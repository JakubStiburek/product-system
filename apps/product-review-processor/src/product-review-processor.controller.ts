import { Controller, Inject } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ReviewAggregateUpdateDto } from './dtos/review-aggregate-update.dto';
import { AddReviewUseCase } from './application/add-review.use-case';
import { RemoveReviewUseCase } from './application/remove-review.use-case';
import { ProductId } from './domain/product-id.vo';
import { UpdateReviewUseCase } from './application/update-review.use-case';

enum Event {
  REVIEW_ADDED = 'review_added',
  REVIEW_REMOVED = 'review_removed',
  REVIEW_UPDATED = 'reveiw_updated',
}

@Controller()
export class ProductReviewProcessorController {
  constructor(
    @Inject() private addReviewUseCase: AddReviewUseCase,
    @Inject() private removeReviewUseCase: RemoveReviewUseCase,
    @Inject() private updateReviewUseCase: UpdateReviewUseCase,
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

    console.log({ dto });

    await this.updateReviewUseCase.execute(dto);
  }
}
