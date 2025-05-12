// src/event-seat/schemas/event-seat.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EventSeatDocument = EventSeat & Document;

@Schema({ timestamps: true })
export class EventSeat {
  @Prop({ type: Types.ObjectId, ref: 'Vendor', required: true })
  vendorId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Company', required: true })
  companyId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'EventSchedule', required: true })
  eventScheduleId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Event', required: true })
  eventId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  userId: Types.ObjectId;

  @Prop({ required: true })
  seatNo: string;

  @Prop({ required: true })
  seatName: string;

  @Prop({ required: true })
  price: number;

  @Prop({ default: false, required: false })
  booked: boolean;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const EventSeatSchema = SchemaFactory.createForClass(EventSeat);
