import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private users: User[] = [];

  async findByEmail(email: string) {
    return Promise.resolve(this.users.find((user) => email === user.email));
  }

  async findOne(id: number) {
    return this.users.find((user) => user.id === id);
  }
}
