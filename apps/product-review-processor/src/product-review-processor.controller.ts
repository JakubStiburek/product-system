import { Controller, Inject } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { ReviewAggregateUpdateDto } from './dtos/review-aggregate-update.dto';
import { ReviewAddedUseCase } from './application/review-added.use-case';
import { ReviewRemovedUseCase } from './application/review-removed.use-case';
import { ProductId } from './domain/product-id.vo';
import { ReviewUpdatedUseCase } from './application/review-updated.use-case';
import { ProductDeletedUseCase } from './application/product-deleted.use-case';
import { GetAverageRatingUseCase } from './application/get-average-rating.use-case';

enum Event {
  REVIEW_ADDED = 'review_added',
  REVIEW_REMOVED = 'review_removed',
  REVIEW_UPDATED = 'reveiw_updated',
  PRODUCT_DELETED = 'product_deleted',
}

enum Message {
  GET_AVERAGE_RATING = 'get_average_rating',
}

@Controller()
export class ProductReviewProcessorController {
  constructor(
    @Inject() private reviewAddedUseCase: ReviewAddedUseCase,
    @Inject() private reviewRemovedUseCase: ReviewRemovedUseCase,
    @Inject() private reviewUpdatedUseCase: ReviewUpdatedUseCase,
    @Inject() private productDeletedUseCase: ProductDeletedUseCase,
    @Inject() private getAverageRatingUseCase: GetAverageRatingUseCase,
  ) {}

  @EventPattern(Event.REVIEW_ADDED)
  async handleReviewAdded(
    @Payload() data: { productId: string; rating: number },
  ) {
    const dto = ReviewAggregateUpdateDto.create(
      ProductId.create(data.productId),
      data.rating,
      true,
    );

    await this.reviewAddedUseCase.execute(dto);
  }

  @EventPattern(Event.REVIEW_REMOVED)
  async handleReviewRemoved(
    @Payload() data: { productId: string; rating: number },
  ) {
    const dto = ReviewAggregateUpdateDto.create(
      ProductId.create(data.productId),
      data.rating,
      false,
    );

    await this.reviewRemovedUseCase.execute(dto);
  }

  @EventPattern(Event.REVIEW_UPDATED)
  async handleReviewUpdated(
    @Payload()
    data: {
      productId: string;
      rating: number;
      shouldAddToSum: boolean;
    },
  ) {
    const dto = ReviewAggregateUpdateDto.create(
      ProductId.create(data.productId),
      data.rating,
      data.shouldAddToSum,
    );

    await this.reviewUpdatedUseCase.execute(dto);
  }

  @EventPattern(Event.PRODUCT_DELETED)
  async handleProductDeleted(@Payload() data: { productId: string }) {
    await this.productDeletedUseCase.execute(ProductId.create(data.productId));
  }

  @MessagePattern(Message.GET_AVERAGE_RATING)
  async getAverageRating(@Payload() data: { productIds: string[] }) {
    return this.getAverageRatingUseCase.execute(
      data.productIds.map((id) => ProductId.create(id)),
    );
  }
}
