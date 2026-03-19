import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Connection, Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectConnection() private connection: Connection,
  ) {}

  async create(user: CreateUserDto): Promise<UserDocument> {
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async update(
    id: string,
    updateDate: Partial<UserDocument>,
  ): Promise<UserDocument | null> {
    return this.userModel
      .findByIdAndUpdate(id, updateDate, { returnDocument: 'after' })
      .exec();
  }

  async remove(id: string): Promise<UserDocument | null> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async transferCredits(fromUserId: string, toUserId: string, amount: number) {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      await this.userModel.findByIdAndUpdate(
        fromUserId,
        { $inc: { credits: -amount } },
        { session },
      );

      await this.userModel.findByIdAndUpdate(
        toUserId,
        { $inc: { credits: amount } },
        { session },
      );

      await session.commitTransaction();
      return { success: true, message: 'Transfer completed' };
    } catch (error) {
      await session.abortTransaction();
    } finally {
      await session.endSession();
    }
  }
}
