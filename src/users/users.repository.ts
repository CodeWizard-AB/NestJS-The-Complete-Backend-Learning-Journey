import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersRepository {
  private users: User[] = [];
  private idCounter = 1;

  async create(data: CreateUserDto): Promise<User> {
    const user: User = {
      id: this.idCounter++,
      ...data,
      createdAt: new Date(),
    };
    this.users.push(user);
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.users;
  }

  async findById(id: number): Promise<User | undefined> {
    return this.users.find((user) => user.id === id);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find((user) => user.email === email);
  }

  async update(id: number, data: UpdateUserDto): Promise<User | undefined> {
    const user = await this.findById(id);
    if (!user) {
      return undefined;
    }
    Object.assign(user, data);
    return user;
  }

  async delete(id: number): Promise<boolean> {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) {
      return false;
    }
    this.users.splice(index, 1);
    return true;
  }
}
