// src/event-seat/event-seat.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventDocument, EventSchema } from './schemas/events.schema';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { User, UserDocument } from '../user/schemas/user.schema'; // User schema
import { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name)
    private eventModel: Model<EventDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(
    createDto: CreateEventDto,
    req: RequestWithUser,
  ): Promise<Event> {
    const created = new this.eventModel({
      ...createDto,
      userId: req.user.userId,
    });
    return created.save();
  }

  async findAll(): Promise<Event[]> {
    return this.eventModel.find().populate('userId').exec();
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.eventModel.findById(id).populate('userId').exec();
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return event;
  }

  async update(id: string, updateDto: UpdateEventDto): Promise<Event> {
    const updated = await this.eventModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();
    if (!updated) {
      throw new NotFoundException('Event not found');
    }
    return updated;
  }

  async remove(id: string): Promise<Event> {
    const deleted = await this.eventModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('Event not found');
    }
    return deleted;
  }
}
