import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
export enum UserType {
  ADMIN = 'admin',
  VENDOR = 'vendor',
  USER = 'user',
}

export type UserDocument = User & Document;

@Schema()
export class User {


  @Prop({ required: true })
  name: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop()
  age: number;

  @Prop({ required: true, enum: UserType })
  type: UserType;

  @Prop({ required: true })
  phoneNo: string; 

  @Prop({ required: true })
  password: string; 

  @Prop()
  seatId: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
