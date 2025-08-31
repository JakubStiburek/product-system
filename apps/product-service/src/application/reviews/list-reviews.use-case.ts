import { Inject, Injectable } from '@nestjs/common';
import { Review as ReviewDB } from '../../entities/review.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReviewAdapter } from '../../infrastracture/review.adapter';
import { CreateReviewResponseDto } from '../../dtos/create-review-response.dto';
import { PaginatedReviewsResponseDto } from '../../dtos/paginated-reviews-response.dto';
import {
  ListReviewsQueryDto,
  SortDirection,
  SortProperty,
} from '../../dtos/list-reviews-query.dto';

@Injectable()
export class ListReviewsUseCase {
  constructor(
    @InjectRepository(ReviewDB)
    private reviewRepository: Repository<ReviewDB>,
    @Inject() private reviewAdapter: ReviewAdapter,
  ) {}

  async execute(
    productId: string,
    page: number = 1,
    limit: number = 10,
    query: ListReviewsQueryDto,
  ) {
    const skip = (page - 1) * limit;

    const sortField = query.sortBy || SortProperty.CREATED_AT;
    const sortDirection = query.sortDirection || SortDirection.DESC;

    const [reviewsRaw, total] = await this.reviewRepository.findAndCount({
      where: { productId },
      skip,
      take: limit,
      order: {
        [sortField]: sortDirection,
      },
    });

    const reviewDtos = reviewsRaw.map((reviewRaw) => {
      const review = this.reviewAdapter.toDomainEntity(reviewRaw);
      return CreateReviewResponseDto.fromDomain(review);
    });

    return new PaginatedReviewsResponseDto(reviewDtos, total, page, limit);
  }
}
