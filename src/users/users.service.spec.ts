// users.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { PasswordService } from './password.service';
import { LoggerService } from './logger.service';
import { EmailService } from './email.service';

describe('UsersService', () => {
  let service: UsersService;
  let repository: UsersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        UsersRepository,
        PasswordService,
        LoggerService,
        EmailService,
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<UsersRepository>(UsersRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const dto = {
      name: 'John',
      email: 'john@example.com',
      password: 'password123',
    };

    const user = await service.create(dto);

    expect(user).toBeDefined();
    expect(user.email).toBe(dto.email);
    expect(user).not.toHaveProperty('password');
  });

  it('should find all users', async () => {
    const users = await service.findAll();
    expect(Array.isArray(users)).toBe(true);
  });
});
