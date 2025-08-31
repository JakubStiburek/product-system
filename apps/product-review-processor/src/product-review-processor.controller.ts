import { Controller, Inject } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ReviewUpdateDto } from './dtos/review-update.dto';
import { AddReviewUseCase } from './application/add-review.use-case';
import { RemoveReviewUseCase } from './application/remove-review.use-case';

enum Event {
  REVIEW_ADDED = 'review_added',
  REVIEW_REMOVED = 'reveiw_removed',
}

@Controller()
export class ProductReviewProcessorController {
  constructor(
    @Inject() private addReviewUseCase: AddReviewUseCase,
    @Inject() private removeReviewUseCase: RemoveReviewUseCase,
  ) {}

  @EventPattern(Event.REVIEW_ADDED)
  async handleReviewAdded(@Payload() data: ReviewUpdateDto) {
    const dto = ReviewUpdateDto.create(data.productId, data.rating);

    await this.addReviewUseCase.execute(dto);
  }

  @EventPattern(Event.REVIEW_REMOVED)
  async handleReviewRemoved(@Payload() data: ReviewUpdateDto) {
    const dto = ReviewUpdateDto.create(data.productId, data.rating);

    await this.removeReviewUseCase.execute(dto);
  }
}
