// src/company/schemas/company.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CompanyDocument = Company & Document;

@Schema({ timestamps: false })
export class Seat {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  capacity: number;

  @Prop({ required: true })
  color: string;
}

@Schema({ timestamps: false })
export class Company {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId; // or string, depending on your usage

  @Prop({ required: true })
  name: string;

  @Prop({ type: [Seat], default: [] })
  seats: Seat[];
}

export const CompanySchema = SchemaFactory.createForClass(Company);
