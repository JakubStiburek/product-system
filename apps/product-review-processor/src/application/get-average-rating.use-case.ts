import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductReviewAggregate as ProductReviewAggregateDB } from '../entities/product-review-aggregate.entity';
import { Repository } from 'typeorm';
import { ProductReviewAggregateAdapter } from '../infrastructure/product-review-aggregate.adapter';
import { ProductId } from '../domain/product-id.vo';

@Injectable()
export class GetAverageRatingUseCase {
  constructor(
    @InjectRepository(ProductReviewAggregateDB)
    private repository: Repository<ProductReviewAggregateDB>,
    @Inject()
    private productReviewAggregateAdapter: ProductReviewAggregateAdapter,
  ) {}

  async execute(productId: ProductId) {
    const existingAggregate = await this.repository.findOneBy({
      productId: productId.value,
    });

    if (existingAggregate) {
      const domainEntity =
        this.productReviewAggregateAdapter.toDomainEntity(existingAggregate);
      return domainEntity.averageRating;
    }
    return undefined;
  }
}
