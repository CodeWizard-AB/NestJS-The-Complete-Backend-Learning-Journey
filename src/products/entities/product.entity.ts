import { ProductCategory, ProductImageDto } from '../dto/create-product.dto';

export class Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category?: ProductCategory;
  tags?: string[];
  images?: ProductImageDto[];
  featured?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
