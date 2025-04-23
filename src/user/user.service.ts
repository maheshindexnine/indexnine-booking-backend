import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(data: Partial<User>): Promise<User> {
    const user = new this.userModel(data);
    return user.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async delete(id: string): Promise<User> {
    const user = await this.userModel.findByIdAndDelete(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
