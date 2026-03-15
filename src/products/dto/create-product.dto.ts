import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

export enum ProductCategory {
  ELECTRONICS = 'electronics',
  CLOTHING = 'clothing',
  FOOD = 'food',
  BOOKS = 'book',
}

export class ProductImageDto {
  @IsUrl()
  url: string;

  @IsString()
  @IsOptional()
  alt: string;
}

export class CreateProductDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  @Transform(({ value }) => value.trim())
  name: string;

  @IsString()
  @MinLength(10)
  @MaxLength(500)
  @Transform(({ value }) => value.trim())
  description: string;

  @IsNumber()
  @Min(0)
  @Max(10000000)
  price: number;

  @IsInt()
  @Min(0)
  stock: number;

  @IsEnum(ProductCategory)
  category: ProductCategory;

  @IsArray()
  @IsString({ each: true })
  @MinLength(3, { each: true })
  @IsOptional()
  tags?: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductImageDto)
  @IsOptional()
  images?: ProductImageDto[];

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  featured?: boolean;
}
