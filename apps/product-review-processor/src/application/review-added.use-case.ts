import { DateTime } from 'luxon';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductReviewAggregate as ProductReviewAggregateDB } from '../entities/product-review-aggregate.entity';
import { ProductReviewAggregate } from '../domain/product-review-aggregate.entity';
import { Repository } from 'typeorm';
import { ReviewAggregateUpdateDto } from '../dtos/review-aggregate-update.dto';
import { ProductReviewAggregateAdapter } from '../infrastructure/product-review-aggregate.adapter';

@Injectable()
export class ReviewAddedUseCase {
  constructor(
    @InjectRepository(ProductReviewAggregateDB)
    private repository: Repository<ProductReviewAggregateDB>,
    @Inject()
    private productReviewAggregateAdapter: ProductReviewAggregateAdapter,
  ) { }

  async execute(dto: ReviewAggregateUpdateDto) {
    const existingAggregateRaw = await this.repository.findOneBy({
      productId: dto.productId.value,
    });

    let aggregate: ProductReviewAggregate;

    if (existingAggregateRaw) {
      aggregate =
        this.productReviewAggregateAdapter.toDomainEntity(existingAggregateRaw);

      aggregate.addReview(dto.rating);

      const updatedAggregateRaw =
        this.productReviewAggregateAdapter.toDBEntity(aggregate);

      await this.repository.update(updatedAggregateRaw._id, {
        reviewCount: updatedAggregateRaw.reviewCount,
        ratingSum: updatedAggregateRaw.ratingSum,
        averageRating: updatedAggregateRaw.averageRating,
        updatedAt: DateTime.now().toUTC().toJSDate(),
      });
    } else {
      const aggregateRaw = this.repository.create({
        productId: dto.productId.value,
        reviewCount: 1,
        ratingSum: dto.rating,
        averageRating: dto.rating,
      });

      await this.repository.save([
        {
          ...aggregateRaw,
          createdAt: DateTime.now().toUTC().toJSDate(),
          updatedAt: DateTime.now().toUTC().toJSDate(),
        },
      ]);
    }
  }
}
