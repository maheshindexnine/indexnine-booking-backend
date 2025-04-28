// src/event-seat/event-seat.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
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

@Injectable()
export class EventSeatService {
  constructor(
    @InjectModel(EventSeat.name)
    private eventSeatModel: Model<EventSeatDocument>,
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
    @InjectModel(EventSchedule.name)
    private eventScheduleModel: Model<EventScheduleDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

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

  async findAll(): Promise<EventSeat[]> {
    return this.eventSeatModel
      .find()
      .populate('userId companyId eventScheduleId userId')
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
