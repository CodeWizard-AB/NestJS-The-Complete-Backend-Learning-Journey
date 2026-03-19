import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @MaxLength(50)
  @MinLength(3)
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password must contain uppercase, lowercase, number, and special character',
  })
  @MinLength(8)
  @IsString()
  @IsNotEmpty()
  password: string;

  @Type(() => Number)
  @Max(100)
  @Min(15)
  @IsInt()
  @IsNotEmpty()
  age: number;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString({ each: true })
  @IsArray()
  hobbies?: string[];

  @Type(() => Date)
  @IsOptional()
  @IsDate()
  createdAt: Date;
}
