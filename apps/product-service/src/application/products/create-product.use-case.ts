import { Inject, Injectable } from '@nestjs/common';
import { Product } from '../../domain/products/product.entity';
import { Product as ProductDB } from '../../entities/product.entity';
import { ProductId } from '../../domain/products/product-id.vo';
import { v4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductAdapter } from '../../infrastracture/product.adapter';
import { ProductDto } from '../../dtos/create-product-response.dto';
import { DateTime } from 'luxon';

@Injectable()
export class CreateProductUseCase {
  constructor(
    @InjectRepository(ProductDB)
    private productRepository: Repository<ProductDB>,
    @Inject() private productAdapter: ProductAdapter,
  ) {}

  async execute(name: string, price: number, description?: string) {
    const productId = ProductId.create(v4());
    const product = Product.create(productId, name, price, description);

    await this.productRepository.save({
      ...this.productAdapter.toDBEntity(product),
      createdAt: DateTime.now().toUTC().toJSDate(),
      updatedAt: DateTime.now().toUTC().toJSDate(),
    });

    return ProductDto.fromDomain(product);
  }
}
