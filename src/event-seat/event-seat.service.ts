// src/event-seat/event-seat.service.ts
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventSeat, EventSeatDocument } from './schemas/event-seat.schema';
import { CreateEventSeatDto } from './dto/create-event-seat.dto';
import { UpdateEventSeatDto } from './dto/update-event-seat.dto';
import { Company, CompanyDocument } from '../company/schemas/company.schema'; // Company schema
import {
  EventSchedule,
  EventScheduleDocument,
} from '../event-schedule/schemas/event-schedule.schema';
import { User, UserDocument } from '../user/schemas/user.schema'; // User schema
import { BookEventSeatDto } from './dto/book-event-seat.dot';
import { ClientKafka, Payload } from '@nestjs/microservices';
import { EventSeatQueryDto } from './dto/event-seat-query.dto';
import { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';

@Injectable()
export class EventSeatService {
  private readonly enableKafka: boolean;
  constructor(
    @InjectModel(EventSeat.name)
    private eventSeatModel: Model<EventSeatDocument>,
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
    @InjectModel(EventSchedule.name)
    private eventScheduleModel: Model<EventScheduleDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {
    this.enableKafka = process.env.ENABLE_KAFKA === 'true';
  }

  async handleCreateSeats(@Payload() message: any): Promise<void> {
    const { eventScheduleId, vendorId, companyId, seats, eventId } = message;

    // Loop through the seat types and create individual seat creation messages
    for (const seatType of seats) {
      for (let i = 1; i <= seatType.capacity; i++) {
        const rowIndex = Math.floor((i - 1) / 10); // 0 for 1–10, 1 for 11–20, etc.
        const rowKey = String.fromCharCode(65 + rowIndex); // 65 is 'A'

        const seatDto: CreateEventSeatDto = {
          vendorId,
          companyId,
          eventScheduleId,
          eventId,
          seatNo: i.toString(),
          seatName: seatType.name,
          price: seatType.price,
          row: rowKey,
          color: seatType.color,
        };

        // Send a Kafka message to create this individual seat
        await this.sendSeatCreationMessage(seatDto);
      }
    }
  }

  // Send a Kafka message to create an individual seat
  private async sendSeatCreationMessage(
    seatDto: CreateEventSeatDto,
  ): Promise<void> {
    const message = {
      vendorId: seatDto.vendorId,
      companyId: seatDto.companyId,
      eventScheduleId: seatDto.eventScheduleId,
      seatNo: seatDto.seatNo,
      seatName: seatDto.seatName,
      price: seatDto.price,
    };

    // Send the message to Kafka's 'create-seat' topic
    await this.kafkaClient.emit('create-seat', message);
  }

  async handleSeatCreation(message: any): Promise<void> {
    const {
      vendorId,
      companyId,
      eventScheduleId,
      seatNo,
      seatName,
      price,
      eventId,
      row,
      color,
    } = message;

    const seatDto: CreateEventSeatDto = {
      vendorId,
      companyId,
      eventScheduleId,
      eventId,
      seatNo,
      seatName,
      row,
      price,
      color,
    };

    // Create the seat in the database
    const createdSeat = new this.eventSeatModel(seatDto);
    await createdSeat.save();

    console.log(
      `Seat created: ${seatNo} for EventSchedule ID: ${eventScheduleId}`,
    );
  }

  async create(createDto: CreateEventSeatDto): Promise<EventSeat> {
    // Check if the vendor, company, eventSchedule, and user exist
    const vendor = await this.userModel.findById(createDto.vendorId);
    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    const company = await this.companyModel.findById(createDto.companyId);
    if (!company) {
      throw new NotFoundException('Company not found');
    }

    const eventSchedule = await this.eventScheduleModel.findById(
      createDto.eventScheduleId,
    );
    if (!eventSchedule) {
      throw new NotFoundException('event not found');
    }

    const created = new this.eventSeatModel(createDto);
    return created.save();
  }

  async book(
    bookDto: BookEventSeatDto,
    req: RequestWithUser,
  ): Promise<EventSeat> {
    const operations = bookDto.ids.map((id) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { userId: req.user.userId, booked: true } },
      },
    }));

    const result = await this.eventSeatModel.bulkWrite(operations);

    if (result.modifiedCount === 0) {
      throw new NotFoundException('No matching Event Seats were updated');
    }
    return result;
  }

  async findAll(filterDto: EventSeatQueryDto): Promise<EventSeat[]> {
    const filter: Record<string, any> = {};
    for (const key in filterDto) {
      if (filterDto[key] !== undefined) {
        filter[key] = filterDto[key];
      }
    }
    return this.eventSeatModel.find(filter).exec();
  }

  async getBookings(
    filterDto: EventSeatQueryDto,
    req: RequestWithUser,
  ): Promise<EventSeat[]> {
    const filter: Record<string, any> = {};
    for (const key in filterDto) {
      if (filterDto[key] !== undefined) {
        filter[key] = filterDto[key];
      }
    }
    return this.eventSeatModel
      .find({ ...filter, userId: req.user.userId })
      .populate('companyId eventScheduleId eventId')
      .exec();
  }

  async findOne(id: string): Promise<EventSeat> {
    const seat = await this.eventSeatModel
      .findById(id)
      .populate('userId companyId eventScheduleId userId')
      .exec();
    if (!seat) {
      throw new NotFoundException('Event Seat not found');
    }
    return seat;
  }

  async update(id: string, updateDto: UpdateEventSeatDto): Promise<EventSeat> {
    const updated = await this.eventSeatModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();
    if (!updated) {
      throw new NotFoundException('Event Seat not found');
    }
    return updated;
  }

  async remove(id: string): Promise<EventSeat> {
    const deleted = await this.eventSeatModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('Event Seat not found');
    }
    return deleted;
  }
}
