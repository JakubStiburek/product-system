import { Inject, Injectable } from '@nestjs/common';
import { Product as ProductDB } from '../../entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductAdapter } from '../../infrastracture/product.adapter';
import { ProductDto } from '../../dtos/create-product-response.dto';
import { ProductNotFoundException } from '../../domain/products/product-not-found.exception';
import { DateTime } from 'luxon';

@Injectable()
export class UpdateProductUseCase {
  constructor(
    @InjectRepository(ProductDB)
    private productRepository: Repository<ProductDB>,
    @Inject() private productAdapter: ProductAdapter,
  ) {}

  async execute(
    id: string,
    name?: string,
    price?: number,
    description?: string,
  ) {
    const existingProductRaw = await this.productRepository.findOneBy({ id });

    if (!existingProductRaw) {
      throw new ProductNotFoundException(id);
    }

    const product = this.productAdapter.toDomainEntity(existingProductRaw);

    const propertiesToUpdate = {
      name,
      price,
      description,
    };

    if (Object.keys(propertiesToUpdate).length === 0) {
      return product;
    }

    product.update(propertiesToUpdate);

    await this.productRepository.save({
      ...this.productAdapter.toDBEntity(product),
      updatedAt: DateTime.now().toUTC().toJSDate(),
    });

    return ProductDto.fromDomain(product);
  }
}
