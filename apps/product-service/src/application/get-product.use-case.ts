import { Inject, Injectable } from '@nestjs/common';
import { Product as ProductDB } from '../entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductAdapter } from '../infrastracture/product.adapter';
import { CreateProductResponseDto } from '../dtos/create-product-response.dto';
import { ProductNotFoundException } from '../domain/products/product-not-found.exception';

@Injectable()
export class GetProductUseCase {
  constructor(
    @InjectRepository(ProductDB)
    private productRepository: Repository<ProductDB>,
    @Inject() private productAdapter: ProductAdapter,
  ) {}

  async execute(id: string) {
    const product = await this.productRepository.findOneBy({ id });

    if (!product) {
      throw new ProductNotFoundException(id);
    }

    const domainProduct = this.productAdapter.toDomainEntity(product);
    return CreateProductResponseDto.fromDomain(domainProduct);
  }
}

