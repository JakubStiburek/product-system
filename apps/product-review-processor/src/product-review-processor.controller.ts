import { Controller, Inject } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { ReviewAggregateUpdateDto } from './dtos/review-aggregate-update.dto';
import { AddReviewUseCase } from './application/add-review.use-case';
import { RemoveReviewUseCase } from './application/remove-review.use-case';
import { ProductId } from './domain/product-id.vo';
import { UpdateReviewUseCase } from './application/update-review.use-case';
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
    @Inject() private addReviewUseCase: AddReviewUseCase,
    @Inject() private removeReviewUseCase: RemoveReviewUseCase,
    @Inject() private updateReviewUseCase: UpdateReviewUseCase,
    @Inject() private productDeletedUseCase: ProductDeletedUseCase,
    @Inject() private getAverageRatingUseCase: GetAverageRatingUseCase,
  ) { }

  @EventPattern(Event.REVIEW_ADDED)
  async handleReviewAdded(
    @Payload() data: { productId: string; rating: number },
  ) {
    const dto = ReviewAggregateUpdateDto.create(
      ProductId.create(data.productId),
      data.rating,
      true,
    );

    await this.addReviewUseCase.execute(dto);
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

    await this.removeReviewUseCase.execute(dto);
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

    await this.updateReviewUseCase.execute(dto);
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
