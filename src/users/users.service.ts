import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserNotFoundException } from 'src/exceptions/user-not-found.exception';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  private users: User[] = [
    { id: 1, name: 'Rafael', email: 'QYKZ9@example.com' },
    { id: 2, name: 'Rafael', email: 'QYKZ9@example.com' },
    { id: 3, name: 'Rafael', email: 'QYKZ9@example.com' },
  ];

  create(createUserDto: CreateUserDto): User {
    if (!createUserDto.name) {
      throw new BadRequestException('Name is required');
    }
    if (!createUserDto.email) {
      throw new BadRequestException('Email is required');
    }

    this.logger.log('Creating new user', { email: createUserDto.email });

    const existing = this.users.find(
      (user) => user.email === createUserDto.email,
    );
    if (existing) {
      this.logger.warn('Duplicate email attempt: ', createUserDto.email);
      throw new ConflictException('Email already exists');
    }

    const newUser = {
      id: this.users.length + 1,
      ...createUserDto,
    };

    this.users.push(newUser);
    this.logger.log('User create successfully', { id: newUser.id });
    return newUser as User;
  }

  findAll() {
    return this.users
  }

  findOne(id: number): User {
    this.logger.log('Find the existing user', { id });
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new UserNotFoundException(+id);
    }
    return user as User;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
