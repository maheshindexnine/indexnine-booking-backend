// src/event-schedule/event-schedule.service.ts
import {
  BadRequestException,
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

@Injectable()
export class EventScheduleService {
  constructor(
    @InjectModel(EventSchedule.name)
    private eventScheduleModel: Model<EventScheduleDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
  ) {}

  async create(createDto: CreateEventScheduleDto): Promise<EventSchedule> {
    // Check if user exists
    const user = await this.userModel.findById(createDto.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

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

    const created = new this.eventScheduleModel(createDto);
    return created.save();
  }

  async findAll(): Promise<EventSchedule[]> {
    return this.eventScheduleModel.find().populate('userId companyId').exec();
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
