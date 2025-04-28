import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';
import { Exclude } from 'class-transformer';
export type UserDocument = User & Document;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class User {
  id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Exclude()
  @Prop({ required: true })
  password: string;

  @Prop({ enum: ['user', 'admin', 'vendor'], default: 'user' })
  type: 'user' | 'admin' | 'vendor';

  createdAt: Date;

  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('id').get(function (this: UserDocument) {
  return this._id;
});
