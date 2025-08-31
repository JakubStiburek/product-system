import { Event } from '../common/rmq/event.enum';
import { Inject, Injectable } from '@nestjs/common';
import { Review as ReviewDB } from '../entities/review.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { ReviewUpdateDto } from '../common/dtos/review-update.dto';
import { ProductId } from '../domain/products/product-id.vo';
import { ReviewNotFoundException } from '../domain/reviews/review-not-found.exception';
import { ReviewAdapter } from '../infrastracture/review.adapter';

@Injectable()
export class DeleteReviewUseCase {
  constructor(
    @InjectRepository(ReviewDB)
    private reviewRepository: Repository<ReviewDB>,
    @Inject() private reviewAdapter: ReviewAdapter,
    @Inject('PRODUCT_SERVICE') private rmqClient: ClientProxy,
  ) {}

  async execute(productId: string, reviewId: string): Promise<void> {
    const existingReviewRaw = await this.reviewRepository.findOneBy({
      id: reviewId,
    });

    if (!existingReviewRaw) {
      throw new ReviewNotFoundException(reviewId);
    }

    const review = this.reviewAdapter.toDomainEntity(existingReviewRaw);

    await this.reviewRepository.delete(review.id.value);

    this.rmqClient.emit(
      Event.REVIEW_REMOVED,
      ReviewUpdateDto.create(ProductId.create(productId), review.rating),
    );
  }
}
