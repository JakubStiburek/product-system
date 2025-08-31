import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductReviewAggregate as ProductReviewAggregateDB } from '../entities/product-review-aggregate.entity';
import { MongoRepository } from 'typeorm';
import { ProductReviewAggregateAdapter } from '../infrastructure/product-review-aggregate.adapter';
import { ProductId } from '../domain/product-id.vo';

@Injectable()
export class GetAverageRatingUseCase {
  constructor(
    @InjectRepository(ProductReviewAggregateDB)
    private repository: MongoRepository<ProductReviewAggregateDB>,
    @Inject()
    private productReviewAggregateAdapter: ProductReviewAggregateAdapter,
  ) {}

  async execute(productIds: ProductId[]) {
    const productIdValues = productIds.map((id) => id.value);

    const existingAggregates = await this.repository.find({
      where: {
        productId: { $in: productIdValues },
      },
    });

    if (existingAggregates.length > 0) {
      return existingAggregates.map((agg) => {
        const item = this.productReviewAggregateAdapter.toDomainEntity(agg);

        return {
          productId: item.productId.value,
          averageRating: item.averageRating,
        };
      });
    }
    return [];
  }
}
