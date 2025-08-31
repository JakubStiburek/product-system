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

    const existingAggregatesRaw = await this.repository.find({
      where: {
        productId: { $in: productIdValues },
      },
    });

    if (existingAggregatesRaw.length > 0) {
      return existingAggregatesRaw.map((aggregateRaw) => {
        const aggregate =
          this.productReviewAggregateAdapter.toDomainEntity(aggregateRaw);

        return {
          productId: aggregate.productId.value,
          averageRating: aggregate.averageRating,
        };
      });
    }
    return [];
  }
}
