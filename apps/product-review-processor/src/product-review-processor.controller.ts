import { Controller, Inject } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ReviewAddedDto } from './dtos/review-added.dto';
import { AddReviewUseCase } from './application/add-review.use-case';

enum Event {
  REVIEW_ADDED = 'review_added',
}

@Controller()
export class ProductReviewProcessorController {
  constructor(@Inject() private addReviewUseCase: AddReviewUseCase) {}

  @EventPattern(Event.REVIEW_ADDED)
  async handleEvent(@Payload() data: ReviewAddedDto) {
    const dto = ReviewAddedDto.create(data.productId, data.rating);

    await this.addReviewUseCase.execute(dto);
  }
}
