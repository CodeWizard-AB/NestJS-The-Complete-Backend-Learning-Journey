import {
  ConflictException,
  Injectable,
  NotFoundException,
  Optional,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import { EmailService } from './email.service';
import { PasswordService } from './password.service';
import { LoggerService } from './logger.service';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly repository: UsersRepository,
    private readonly passwordService: PasswordService,
    @Optional() private readonly emailService: EmailService,
    private readonly logger: LoggerService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    this.logger.log(`Creating user: ${createUserDto.email}`, 'UsersService');

    const existingUser = await this.repository.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await this.passwordService.hashPassword(
      createUserDto.password,
    );
    const newUser = await this.repository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    if (this.emailService) {
      await this.emailService.sendWelcomeEmail(newUser.email, newUser.name);
    }

    this.logger.log(`User created with ID: ${newUser.id}`, 'UsersService');

    const { password, ...user } = newUser;
    return user as User;
  }

  async findAll(): Promise<User[]> {
    this.logger.log('Fetching all users', 'UsersService');
    const users = await this.repository.findAll();
    return users.map(({ password, ...rest }) => rest as User);
  }

  async findOne(id: number): Promise<User> {
    this.logger.log(`Fetching user with ID: ${id}`, 'UsersService');
    const user = await this.repository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const { password, ...rest } = user;
    return rest as User;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    this.logger.log(`Updating user with ID: ${id}`, 'UsersService');
    const user = await this.repository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const updatedUser = await this.repository.update(id, updateUserDto);
    const { password, ...rest } = updatedUser!;
    return rest as User;
  }

  async remove(id: number) {
    this.logger.log(`Removing user with ID: ${id}`, 'UsersService');
    const deleted = await this.repository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return { success: deleted };
  }
}
