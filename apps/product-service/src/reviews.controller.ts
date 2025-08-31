import {
  Controller,
  Post,
  Body,
  Inject,
  Put,
  Param,
  Get,
  Delete,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { PaginationDto } from './dtos/pagination.dto';
import { CreateReviewDto } from './dtos/create-review.dto';
import { UpdateReviewDto } from './dtos/update-review.dto';
import { CreateReviewUseCase } from './application/reviews/create-review.use-case';
import { UpdateReviewUseCase } from './application/reviews/update-review.use-case';
import { DeleteReviewUseCase } from './application/reviews/delete-review.use-case';
import { ListReviewsUseCase } from './application/reviews/list-reviews.use-case';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateReviewResponseDto } from './dtos/create-review-response.dto';
import { PaginatedReviewsResponseDto } from './dtos/paginated-reviews-response.dto';
import { UuidDto } from './common/dtos/uuid.dto';
import { ReviewIdDto } from './dtos/review-id.dto';
import { ListReviewsQueryDto } from './dtos/list-reviews-query.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('api/v1')
export class ReviewsController {
  constructor(
    @Inject() private createReviewUseCase: CreateReviewUseCase,
    @Inject() private updateReviewUseCase: UpdateReviewUseCase,
    @Inject() private deleteReviewUseCase: DeleteReviewUseCase,
    @Inject() private listReviewsUseCase: ListReviewsUseCase,
  ) {}

  @UseInterceptors(CacheInterceptor)
  @Get('products/:id/reviews')
  @ApiOperation({
    summary: 'Lists reviews for a product with pagination',
  })
  @ApiResponse({
    status: 200,
    description: 'Reviews retrieved successfully',
    type: PaginatedReviewsResponseDto,
  })
  async listReviews(
    @Param() { id }: UuidDto,
    @Query() pagination: PaginationDto,
    @Query() query: ListReviewsQueryDto,
  ) {
    return this.listReviewsUseCase.execute(
      id,
      pagination.page,
      pagination.limit,
      query,
    );
  }

  @Post('products/:id/reviews')
  @ApiOperation({
    summary: 'Creates new review for a product',
  })
  @ApiResponse({
    status: 201,
    description: 'Review created successfully',
    type: CreateReviewResponseDto,
  })
  async createReview(@Param() { id }: UuidDto, @Body() dto: CreateReviewDto) {
    return this.createReviewUseCase.execute(
      id,
      dto.firstName,
      dto.lastName,
      dto.content,
      dto.rating,
    );
  }

  @Put('products/:id/reviews/:reviewId')
  @ApiOperation({
    summary: 'Updates existing review',
  })
  @ApiResponse({
    status: 200,
    description: 'Review updated successfully',
    type: CreateReviewResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Review not found',
  })
  async updateReview(
    @Param() { id }: UuidDto,
    @Param() { reviewId }: ReviewIdDto,
    @Body() dto: UpdateReviewDto,
  ) {
    return this.updateReviewUseCase.execute(
      id,
      reviewId,
      dto.firstName,
      dto.lastName,
      dto.content,
      dto.rating,
    );
  }

  @Delete('products/:id/reviews/:reviewId')
  @ApiOperation({
    summary: 'Deletes review by ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Review deleted successfully',
  })
  async deleteReview(
    @Param() { id }: UuidDto,
    @Param() { reviewId }: ReviewIdDto,
  ) {
    return this.deleteReviewUseCase.execute(id, reviewId);
  }
}
