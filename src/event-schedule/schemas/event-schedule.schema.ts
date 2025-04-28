// src/event-schedule/schemas/event-schedule.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EventScheduleDocument = EventSchedule & Document;

@Schema({ timestamps: true })
export class EventSchedule {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Company', required: true })
  companyId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  date: Date;

  @Prop({
    type: [{ name: String, price: Number }],
    required: true,
    validate: [(val) => val.length > 0, 'At least one seat type is required'],
  })
  seatTypes: { name: string; price: number }[];

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const EventScheduleSchema = SchemaFactory.createForClass(EventSchedule);
