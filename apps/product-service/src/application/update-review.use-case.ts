import { Inject, Injectable } from '@nestjs/common';
import { Review as ReviewDB } from '../entities/review.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReviewAdapter } from '../infrastracture/review.adapter';
import { CreateReviewResponseDto } from '../dtos/create-review-response.dto';
import { ReviewNotFoundException } from '../domain/reviews/review-not-found.exception';

@Injectable()
export class UpdateReviewUseCase {
  constructor(
    @InjectRepository(ReviewDB)
    private reviewRepository: Repository<ReviewDB>,
    @Inject() private reviewAdapter: ReviewAdapter,
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

    const review = this.reviewAdapter.toDomainEntity(existingReview);
    review.update({ firstName, lastName, content, rating });

    const updatedReviewDB = this.reviewRepository.merge(
      existingReview,
      this.reviewAdapter.toDBEntity(review),
    );

    await this.reviewRepository.save(updatedReviewDB);

    return CreateReviewResponseDto.fromDomain(review);
  }
}
