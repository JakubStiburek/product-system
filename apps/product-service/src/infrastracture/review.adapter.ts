import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../domain/reviews/review.entity';
import { Review as ReviewDB } from '../entities/review.entity';
import { ReviewId } from '../domain/reviews/review-id.vo';
import { ProductId } from '../domain/products/product-id.vo';

@Injectable()
export class ReviewAdapter {
  constructor(
    @InjectRepository(ReviewDB)
    private reviewRepository: Repository<ReviewDB>,
  ) {}

  toDBEntity(review: Review): ReviewDB {
    return this.reviewRepository.create({
      id: review.id.value,
      productId: review.productId.value,
      firstName: review.firstName,
      lastName: review.lastName,
      content: review.content,
      rating: review.rating,
    });
  }

  toDomainEntity(review: ReviewDB): Review {
    return Review.create(
      ReviewId.create(review.id),
      ProductId.create(review.productId),
      review.firstName,
      review.lastName,
      review.content,
      review.rating,
    );
  }
}
