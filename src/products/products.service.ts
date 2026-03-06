import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductEntity } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  private products: ProductEntity[] = [
    {
      id: 1,
      name: 'Product 1',
      price: 100,
      description: 'Description of Product 1',
    },
    {
      id: 2,
      name: 'Product 2',
      price: 200,
      description: 'Description of Product 2',
    },
    {
      id: 3,
      name: 'Product 3',
      price: 300,
      description: 'Description of Product 3',
    },
    {
      id: 4,
      name: 'Product 4',
      price: 400,
      description: 'Description of Product 4',
    },
    {
      id: 5,
      name: 'Product 5',
      price: 500,
      description: 'Description of Product 5',
    },
    {
      id: 6,
      name: 'Product 6',
      price: 600,
      description: 'Description of Product 6',
    },
    {
      id: 7,
      name: 'Product 7',
      price: 700,
      description: 'Description of Product 7',
    },
    {
      id: 8,
      name: 'Product 8',
      price: 800,
      description: 'Description of Product 8',
    },
    {
      id: 9,
      name: 'Product 9',
      price: 900,
      description: 'Description of Product 9',
    },
    {
      id: 10,
      name: 'Product 10',
      price: 1000,
      description: 'Description of Product 10',
    },
  ];

  findAll({
    page,
    limit,
    search,
  }: {
    page?: number;
    limit?: number;
    search?: string;
  }) {
    let filteredProducts = this.products;

    if (search) {
      filteredProducts = filteredProducts.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (page && limit) {
      const start = (+page - 1) * +limit;
      const end = start + +limit;
      filteredProducts = filteredProducts.slice(start, end);
    }

    return {
      data: filteredProducts,
      total: filteredProducts.length,
      page: page ? +page : 1,
      limit: limit ? +limit : filteredProducts.length,
    };
  }

  findOne(id: number): ProductEntity {
    const product = this.products.find((product) => product.id === +id);

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  create(product: CreateProductDto) {
    const newProduct: ProductEntity = {
      id: this.products.length + 1,
      ...product,
    };
    this.products.push(newProduct);

    return {
      message: 'Product created successfully',
      data: newProduct,
    };
  }

  update(id: number, product: UpdateProductDto) {
    const productToUpdate = this.products.find((p) => p.id === id);
    if (!productToUpdate) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    Object.assign(productToUpdate, product);
    return {
      message: 'Product updated successfully',
      data: productToUpdate,
    };
  }

  delete(id: number) {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    this.products.splice(index, 1);
    return {
      message: 'Product deleted successfully',
    };
  }
}
