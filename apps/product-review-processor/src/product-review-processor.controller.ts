import { Controller, Get } from '@nestjs/common';
import { ProductReviewProcessorService } from './product-review-processor.service';

@Controller()
export class ProductReviewProcessorController {
  constructor(private readonly productReviewProcessorService: ProductReviewProcessorService) {}

  @Get()
  getHello(): string {
    return this.productReviewProcessorService.getHello();
  }
}
