import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { QueryProductDto } from './dto/query-product.dto';

@Injectable()
export class ProductsService {
  private products: Product[] = [];

  create(createProductDto: CreateProductDto) {
    const product = {
      id: this.products.length + 1,
      ...createProductDto,
      createdAt: new Date(),
    };
    this.products.push(product);
    return product;
  }

  findAll(query: QueryProductDto) {
    let filtered = this.products;

    if (query.category) {
      filtered = filtered.filter(
        (product) => product.category === query.category,
      );
    }

    if (query.search) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(query.search?.toLowerCase()!),
      );
    }

    filtered.sort((a, b) => {
      const aValue = +a[query.sort!]!;
      const bValue = +b[query.sort!]!;
      return query.order === 'asc' ? aValue - bValue : bValue - aValue;
    });

    const start = (query.page! - 1) * query.limit!;
    const end = start + query.limit!;
    filtered = filtered.slice(start, end);

    return {
      data: filtered,
      meta: {
        total: filtered.length,
        page: query.page!,
        limit: query.limit!,
        totalPages: Math.ceil(filtered.length / query.limit!),
      },
    };
  }

  findOne(id: number) {
    return this.products.find((p) => p.id === id);
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    const index = this.products.findIndex((p) => p.id === id);
    if (index > -1) {
      this.products[index] = {
        ...this.products[index],
        ...updateProductDto,
        updatedAt: new Date(),
      };
      return this.products[index];
    }
    return null;
  }

  remove(id: number) {
    const index = this.products.findIndex((p) => p.id === id);
    if (index > -1) {
      this.products.splice(index, 1);
      return { deleted: true };
    }
    return { deleted: false };
  }
}
