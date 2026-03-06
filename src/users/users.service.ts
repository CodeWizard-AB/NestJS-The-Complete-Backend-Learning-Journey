import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private users: (CreateUserDto & { id: number })[] = [
    { id: 1, name: 'John Doe', email: 'a@b.com', password: 'password1' },
    { id: 2, name: 'Jane Doe', email: 'c@d.com', password: 'password2' },
    { id: 3, name: 'Bob Smith', email: 'e@f.com', password: 'password3' },
  ];

  create(createUserDto: CreateUserDto) {
    const newUser = { ...createUserDto, id: this.users.length + 1 };
    this.users.push(newUser);
    return {
      message: 'User created successfully',
      user: newUser,
    };
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'User not found',
        error: 'Not Found',
        timestamp: new Date().toISOString(),
      });
    }

    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
