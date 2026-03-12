import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DateService, LoggerService } from 'src/shared/shared.service';
import { ConfigService } from 'src/config/config.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly dateService: DateService,
    private readonly configService: ConfigService,
  ) {
    this.loggerService.log('UsersService created');
    console.log(this.dateService.now());
    console.log(this.dateService.format(new Date()));
    console.log(this.configService.get('folder'));
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
