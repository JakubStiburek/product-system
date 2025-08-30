import { Injectable } from '@nestjs/common';
import { Review as ReviewDB } from '../entities/review.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class DeleteReviewUseCase {
  constructor(
    @InjectRepository(ReviewDB)
    private reviewRepository: Repository<ReviewDB>,
  ) {}

  async execute(productId: string, reviewId: string): Promise<void> {
    await this.reviewRepository.delete(reviewId);
  }
}
