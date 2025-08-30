import { Inject, Injectable } from '@nestjs/common';
import { Product as ProductDB } from '../entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductAdapter } from '../infrastracture/product.adapter';
import { CreateProductResponseDto } from '../dtos/create-product-response.dto';
import { PaginatedProductsResponseDto } from '../dtos/paginated-products-response.dto';

@Injectable()
export class ListProductsUseCase {
  constructor(
    @InjectRepository(ProductDB)
    private productRepository: Repository<ProductDB>,
    @Inject() private productAdapter: ProductAdapter,
  ) {}

  async execute(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [products, total] = await this.productRepository.findAndCount({
      skip,
      take: limit,
      order: {
        createdAt: 'DESC',
      },
    });

    const productDtos = products.map((product) => {
      const domainProduct = this.productAdapter.toDomainEntity(product);
      return CreateProductResponseDto.fromDomain(domainProduct);
    });

    return new PaginatedProductsResponseDto(productDtos, total, page, limit);
  }
}
