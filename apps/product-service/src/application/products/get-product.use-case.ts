import { Inject, Injectable } from '@nestjs/common';
import { Product as ProductDB } from '../../entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductAdapter } from '../../infrastracture/product.adapter';
import { ProductDto } from '../../dtos/create-product-response.dto';
import { ProductNotFoundException } from '../../domain/products/product-not-found.exception';
import { AverageRatingService } from './average-rating.service';
import { ProductId } from '../../domain/products/product-id.vo';

@Injectable()
export class GetProductUseCase {
  constructor(
    @InjectRepository(ProductDB)
    private productRepository: Repository<ProductDB>,
    @Inject() private productAdapter: ProductAdapter,
    @Inject() private averageRatingsService: AverageRatingService,
  ) {}

  async execute(id: string) {
    const product = await this.productRepository.findOneBy({ id });

    if (!product) {
      throw new ProductNotFoundException(id);
    }

    const averageRatings = await this.averageRatingsService.getAverageRatings([
      ProductId.create(id),
    ]);

    const domainProduct = this.productAdapter.toDomainEntity(
      product,
      averageRatings.find((item) => item.productId === product.id)
        ?.averageRating,
    );
    return ProductDto.fromDomain(domainProduct);
  }
}
