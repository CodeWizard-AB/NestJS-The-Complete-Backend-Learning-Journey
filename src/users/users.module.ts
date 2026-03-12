import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { LoggerService } from './logger.service';
import { EmailService } from './email.service';
import { PasswordService } from './password.service';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    LoggerService,
    EmailService,
    PasswordService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
