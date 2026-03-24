import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async recordFailedLogin(id: string) {
    return await this.userModel.updateOne(
      { _id: id },
      { $inc: { failedLoginAttempts: 1 } },
    );
  }

  async resetFailedLogin(id: string) {
    return await this.userModel.updateOne(
      { _id: id },
      { $set: { failedLoginAttempts: 0 } },
    );
  }

  create(createUserDto: CreateUserDto) {
    return this.userModel.create(createUserDto);
  }

  async findAll() {
    return await this.userModel.find();
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }

  async findById(id: string) {
    return await this.userModel.findById(id);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.userModel.findByIdAndUpdate(id, updateUserDto, {
      returnDocument: 'after',
    });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
