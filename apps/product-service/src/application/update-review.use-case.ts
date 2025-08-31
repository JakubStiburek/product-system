import { Event } from '../common/rmq/event.enum';
import { Inject, Injectable } from '@nestjs/common';
import { Review as ReviewDB } from '../entities/review.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReviewAdapter } from '../infrastracture/review.adapter';
import { CreateReviewResponseDto } from '../dtos/create-review-response.dto';
import { ReviewNotFoundException } from '../domain/reviews/review-not-found.exception';
import { ClientProxy } from '@nestjs/microservices';
import { ReviewUpdateDto } from '../common/dtos/review-update.dto';
import { ProductId } from '../domain/products/product-id.vo';
import { DateTime } from 'luxon';

@Injectable()
export class UpdateReviewUseCase {
  constructor(
    @InjectRepository(ReviewDB)
    private reviewRepository: Repository<ReviewDB>,
    @Inject() private reviewAdapter: ReviewAdapter,
    @Inject('PRODUCT_SERVICE') private rmqClient: ClientProxy,
  ) {}

  async execute(
    productId: string,
    reviewId: string,
    firstName?: string,
    lastName?: string,
    content?: string,
    rating?: number,
  ) {
    const existingReview = await this.reviewRepository.findOneBy({
      id: reviewId,
    });

    if (!existingReview) {
      throw new ReviewNotFoundException(reviewId);
    }

    const ratingDiff = rating ? rating - existingReview.rating : undefined;

    const review = this.reviewAdapter.toDomainEntity(existingReview);
    review.update({ firstName, lastName, content, rating });

    const updatedReviewDB = this.reviewRepository.merge(
      existingReview,
      this.reviewAdapter.toDBEntity(review),
    );

    await this.reviewRepository.save({
      ...updatedReviewDB,
      updatedAt: DateTime.now().toUTC().toJSDate(),
    });

    if (ratingDiff) {
      this.rmqClient.emit(
        Event.REVIEW_UPDATED,
        ReviewUpdateDto.create(
          ProductId.create(productId),
          Math.abs(ratingDiff),
          !!(ratingDiff > 0),
        ),
      );
    }
    return CreateReviewResponseDto.fromDomain(review);
  }
}
