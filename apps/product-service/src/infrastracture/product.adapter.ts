import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../domain/products/product.entity';
import { Product as ProductDB } from '../entities/product.entity';
import { centsToEurosTransformer } from '../common/utils/cents-to-euros.transformer';
import { ProductId } from '../domain/products/product-id.vo';

@Injectable()
export class ProductAdapter {
  constructor(
    @InjectRepository(ProductDB)
    private productRepository: Repository<ProductDB>,
  ) {}

  toDBEntity(product: Product): ProductDB {
    return this.productRepository.create({
      id: product.id.value,
      name: product.name,
      price: centsToEurosTransformer.to(product.price),
      description: product.description,
    });
  }

  toDomainEntity(product: ProductDB): Product {
    return Product.create(
      ProductId.create(product.id),
      product.name,
      centsToEurosTransformer.from(product.name),
      product.description,
    );
  }
}
