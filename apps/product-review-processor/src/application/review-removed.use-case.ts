import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductReviewAggregate as ProductReviewAggregateDB } from '../entities/product-review-aggregate.entity';
import { Repository } from 'typeorm';
import { ReviewAggregateUpdateDto } from '../dtos/review-aggregate-update.dto';
import { ProductReviewAggregateAdapter } from '../infrastructure/product-review-aggregate.adapter';
import { DateTime } from 'luxon';

@Injectable()
export class ReviewRemovedUseCase {
  constructor(
    @InjectRepository(ProductReviewAggregateDB)
    private repository: Repository<ProductReviewAggregateDB>,
    @Inject()
    private productReviewAggregateAdapter: ProductReviewAggregateAdapter,
  ) {}

  async execute(dto: ReviewAggregateUpdateDto) {
    const existingAggregateRaw = await this.repository.findOneBy({
      productId: dto.productId.value,
    });

    if (existingAggregateRaw) {
      const aggregate =
        this.productReviewAggregateAdapter.toDomainEntity(existingAggregateRaw);

      aggregate.removeReview(dto.rating);

      const updatedAggregateRaw =
        this.productReviewAggregateAdapter.toDBEntity(aggregate);

      await this.repository.update(updatedAggregateRaw._id, {
        reviewCount: updatedAggregateRaw.reviewCount,
        ratingSum: updatedAggregateRaw.ratingSum,
        averageRating: updatedAggregateRaw.averageRating,
        updatedAt: DateTime.now().toUTC().toJSDate(),
      });
    }
  }
}
