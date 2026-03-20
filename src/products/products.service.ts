import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { type Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Product, ProductDocument } from './schemas/product.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const product = await this.productModel.create(createProductDto);
    await this.cacheManager.del('all_products');
    this.logger.log('Clear all cached products');
    return { data: product };
  }

  async findAll(page: number = 1, limit: number = 10) {
    const cacheKey = `products_page_${page}_limit_${limit}`;
    const cachedProducts =
      await this.cacheManager.get<ProductDocument[]>(cacheKey);

    if (cachedProducts) {
      this.logger.log(`✅ Cache hit: ${cacheKey}`);
      return { data: cachedProducts };
    }

    this.logger.log(`❌ Cache miss: ${cacheKey}`);

    const [products, total] = await Promise.all([
      this.productModel
        .find()
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.productModel.countDocuments(),
    ]);

    this.cacheManager.set(cacheKey, products);
    this.logger.log(`✅ Set cache: ${cacheKey}`);

    return {
      data: products,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const cacheKey = `product_${id}`;
    const cachedProduct =
      await this.cacheManager.get<ProductDocument>(cacheKey);

    if (cachedProduct) {
      this.logger.log(`✅ Cache hit: ${cacheKey}`);
      return { data: cachedProduct };
    }

    this.logger.log(`❌ Cache miss: ${cacheKey}`);
    const product = await this.productModel.findById(id).exec();

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    this.cacheManager.set(cacheKey, product);
    this.logger.log(`✅ Set cache: ${cacheKey}`);

    return { data: product };
  }

  async findByCategory(category: string) {
    const cacheKey = `category_${category}`;
    const cachedProducts =
      await this.cacheManager.get<ProductDocument[]>(cacheKey);

    if (cachedProducts) {
      this.logger.log(`✅ Cache hit: ${cacheKey}`);
      return { data: cachedProducts };
    }

    this.logger.log(`❌ Cache miss: ${cacheKey}`);
    const products = await this.productModel
      .find({ category })
      .sort({ createdAt: -1 })
      .exec();

    this.cacheManager.set(cacheKey, products);
    this.logger.log(`✅ Set cache: ${cacheKey}`);

    return { data: products };
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productModel
      .findByIdAndUpdate(id, updateProductDto, { returnDocument: 'after' })
      .exec();

    await this.cacheManager.del('all_products');
    await this.cacheManager.del(`product_${id}`);
    this.logger.log('Clear all cached products');

    return { data: product };
  }

  async remove(id: number) {
    await this.productModel.findByIdAndDelete(id).exec();

    await this.cacheManager.del('all_products');
    await this.cacheManager.del(`product_${id}`);

    return { message: 'Product deleted successfully' };
  }

  async search(keyword: string) {
    const normalizedWord = keyword.toLowerCase().trim();
    const cacheKey = `search_${normalizedWord}`;
    const cachedProducts =
      await this.cacheManager.get<ProductDocument[]>(cacheKey);

    if (cachedProducts) {
      this.logger.log(`✅ Cache hit: ${cacheKey}`);
      return { data: cachedProducts };
    }

    this.logger.log(`❌ Cache miss: ${cacheKey}`);
    const products = await this.productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } },
          { tags: { $regex: keyword, $options: 'i' } },
        ],
      })
      .limit(20)
      .exec();

    this.cacheManager.set(cacheKey, products);
    this.logger.log(`✅ Set cache: ${cacheKey}`);

    return { data: products };
  }
}
