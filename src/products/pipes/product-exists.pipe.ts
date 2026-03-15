import { PipeTransform, Injectable, NotFoundException } from '@nestjs/common';
import { ProductsService } from '../products.service';

@Injectable()
export class ProductExistsPipe implements PipeTransform {
  constructor(private productsService: ProductsService) {}

  transform(productId: number) {
    const product = this.productsService.findOne(productId);

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    return product;
  }
}
