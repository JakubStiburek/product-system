import { Inject, Injectable } from '@nestjs/common';
import { Review } from '../domain/reviews/review.entity';
import { Review as ReviewDB } from '../entities/review.entity';
import { ReviewId } from '../domain/reviews/review-id.vo';
import { ProductId } from '../domain/products/product-id.vo';
import { v4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReviewAdapter } from '../infrastracture/review.adapter';
import { CreateReviewResponseDto } from '../dtos/create-review-response.dto';

@Injectable()
export class CreateReviewUseCase {
  constructor(
    @InjectRepository(ReviewDB)
    private reviewRepository: Repository<ReviewDB>,
    @Inject() private reviewAdapter: ReviewAdapter,
  ) {}

  async execute(
    productId: string,
    firstName: string,
    lastName: string,
    content: string,
    rating: number,
  ) {
    const reviewId = ReviewId.create(v4());
    const productIdVO = ProductId.create(productId);
    const review = Review.create(
      reviewId,
      productIdVO,
      firstName,
      lastName,
      content,
      rating,
    );

    await this.reviewRepository.save([this.reviewAdapter.toDBEntity(review)]);

    return CreateReviewResponseDto.fromDomain(review);
  }
}
