// src/event-schedule/event-schedule.service.ts
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  EventSchedule,
  EventScheduleDocument,
} from './schemas/event-schedule.schema';
import { CreateEventScheduleDto } from './dto/create-event-schedule.dto';
import { UpdateEventScheduleDto } from './dto/update-event-schedule.dto';
import { User, UserDocument } from '../user/schemas/user.schema'; // User schema
import { Company, CompanyDocument } from '../company/schemas/company.schema'; // Company schema
import { CreateEventSeatDto } from 'src/event-seat/dto/create-event-seat.dto';
import { EventSeatService } from 'src/event-seat/event-seat.service';
import { ClientKafka } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { EventScheduleQueryDto } from './dto/event-schedule-query.dto';
import { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';

@Injectable()
export class EventScheduleService {
  constructor(
    @InjectModel(EventSchedule.name)
    private eventScheduleModel: Model<EventScheduleDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
    private eventSeatService: EventSeatService,
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
    private readonly configService: ConfigService,
  ) {}

  async create(
    createDto: CreateEventScheduleDto,
    req: RequestWithUser,
  ): Promise<EventSchedule> {
    // Check if company exists
    const company = await this.companyModel.findById(createDto.companyId);
    if (!company) {
      throw new NotFoundException('Company not found');
    }

    // Map user-provided seats and enrich with capacity from company
    const enrichedSeats = createDto.seatTypes.map((userSeat) => {
      const matchingCompanySeat = company.seats.find(
        (companySeat) => companySeat.name === userSeat.name,
      );
      if (!matchingCompanySeat) {
        throw new BadRequestException(
          `Seat type "${userSeat.name}" not found in company`,
        );
      }
      return {
        ...userSeat,
        capacity: matchingCompanySeat.capacity,
      };
    });

    // Assign enriched seats back to DTO
    (createDto as any).seatTypes = enrichedSeats;

    const created = new this.eventScheduleModel({
      ...createDto,
      userId: req.user.userId,
    });
    const savedEvent = await created.save();

    // create seats
    const enableKafka =
      this.configService.get<string>('ENABLE_KAFKA') === 'true';

    if (enableKafka) {
      await this.sendSeatsCreationMessage(savedEvent, enrichedSeats);
    } else {
      await this.createSeatsForEvent(enrichedSeats, savedEvent);
    }

    return savedEvent;
  }

  // Function to send the message to Kafka
  private async sendSeatsCreationMessage(
    savedEvent: EventSchedule,
    enrichedSeats: any[],
  ): Promise<void> {
    console.log(savedEvent, ' savedEventsavedEventsavedEventsavedEvent');

    const message = {
      // @ts-ignore
      eventScheduleId: savedEvent._id.toString(),
      vendorId: savedEvent.userId.toString(),
      companyId: savedEvent.companyId.toString(),
      eventId: savedEvent.eventId.toString(),
      seats: enrichedSeats,
    };
    console.log('called here start', message);

    // Send the message to Kafka's 'create-seats' topic
    await this.kafkaClient.emit('create-seats', message);
  }

  // Function to create seats asynchronously
  private async createSeatsForEvent(
    seatTypes: any[],
    savedEvent: EventSchedule,
  ): Promise<void> {
    for (const seatType of seatTypes) {
      for (let i = 1; i <= seatType.capacity; i++) {
        const rowIndex = Math.floor((i - 1) / 10); // 0 for 1–10, 1 for 11–20, etc.
        const rowKey = String.fromCharCode(65 + rowIndex); // 65 is 'A'

        const seatDto: CreateEventSeatDto = {
          vendorId: savedEvent.userId.toString(),
          companyId: savedEvent.companyId.toString(),
          // @ts-ignore
          eventScheduleId: savedEvent._id.toString(),
          eventId: savedEvent.eventId.toString(),
          seatNo: i.toString(),
          seatName: seatType.name,
          price: seatType.price,
          row: rowKey, // ✅ added row key
        };

        // Create the seat asynchronously without awaiting
        this.eventSeatService.create(seatDto); // This does not block the execution
      }
    }
  }

  async findAll(
    filterDto: EventScheduleQueryDto,
    req: RequestWithUser,
  ): Promise<EventSchedule[]> {
    const filter: Record<string, any> = {};
    for (const key in filterDto) {
      if (filterDto[key] !== undefined) {
        // Special handling for date to ignore time
        if (key === 'date') {
          const date = new Date(filterDto[key]);
          filter[key] = {
            $gte: new Date(date.setHours(0, 0, 0, 0)),
            $lt: new Date(date.setHours(23, 59, 59, 999)),
          };
        } else {
          filter[key] = filterDto[key];
        }
      }
    }

    return this.eventScheduleModel
      .find(filter)
      .populate('eventId companyId')
      .exec();
  }

  async findOne(id: string): Promise<EventSchedule> {
    const schedule = await this.eventScheduleModel
      .findById(id)
      .populate('userId companyId')
      .exec();
    if (!schedule) {
      throw new NotFoundException('Event Schedule not found');
    }
    return schedule;
  }

  async update(
    id: string,
    updateDto: UpdateEventScheduleDto,
  ): Promise<EventSchedule> {
    const updated = await this.eventScheduleModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();
    if (!updated) {
      throw new NotFoundException('Event Schedule not found');
    }
    return updated;
  }

  async remove(id: string): Promise<EventSchedule> {
    const deleted = await this.eventScheduleModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('Event Schedule not found');
    }
    return deleted;
  }
}
