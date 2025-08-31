import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductReviewAggregate as ProductReviewAggregateDB } from '../entities/product-review-aggregate.entity';
import { Repository } from 'typeorm';
import { ReviewAggregateUpdateDto } from '../dtos/review-aggregate-update.dto';
import { ProductReviewAggregateAdapter } from '../infrastructure/product-review-aggregate.adapter';

@Injectable()
export class RemoveReviewUseCase {
  constructor(
    @InjectRepository(ProductReviewAggregateDB)
    private repository: Repository<ProductReviewAggregateDB>,
    @Inject()
    private productReviewAggregateAdapter: ProductReviewAggregateAdapter,
  ) {}

  async execute(dto: ReviewAggregateUpdateDto) {
    const existingAggregate = await this.repository.findOneBy({
      productId: dto.productId.value,
    });

    if (existingAggregate) {
      const domainEntity =
        this.productReviewAggregateAdapter.toDomainEntity(existingAggregate);

      domainEntity.removeReview(dto.rating);

      const dbEntity =
        this.productReviewAggregateAdapter.toDBEntity(domainEntity);

      await this.repository.update(dbEntity._id, {
        reviewCount: dbEntity.reviewCount,
        ratingSum: dbEntity.ratingSum,
        averageRating: dbEntity.averageRating,
        updatedAt: new Date(),
      });
    }
  }
}
