import { Inject, Injectable } from '@nestjs/common';
import { Product as ProductDB } from '../../entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductAdapter } from '../../infrastracture/product.adapter';
import { ProductDto } from '../../dtos/create-product-response.dto';
import { PaginatedProductsResponseDto } from '../../dtos/paginated-products-response.dto';
import { ProductId } from '../../domain/products/product-id.vo';
import { AverageRatingService } from './average-rating.service';

@Injectable()
export class ListProductsUseCase {
  constructor(
    @InjectRepository(ProductDB)
    private productRepository: Repository<ProductDB>,
    @Inject() private productAdapter: ProductAdapter,
    @Inject() private averageRatingsService: AverageRatingService,
  ) {}

  async execute(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [productsRaw, total] = await this.productRepository.findAndCount({
      skip,
      take: limit,
      order: {
        createdAt: 'DESC',
      },
    });

    const productIds = productsRaw.map((product) =>
      ProductId.create(product.id),
    );

    const averageRatings =
      await this.averageRatingsService.getAverageRatings(productIds);

    const productDtos = productsRaw.map((productRaw) => {
      const averageRating = averageRatings.find(
        (item) => item.productId === productRaw.id,
      )?.averageRating;

      const product = this.productAdapter.toDomainEntity(
        productRaw,
        averageRating,
      );

      return ProductDto.fromDomain(product);
    });

    return new PaginatedProductsResponseDto(productDtos, total, page, limit);
  }
}
