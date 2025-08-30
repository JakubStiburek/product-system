import { Module } from '@nestjs/common';
import { ProductReviewProcessorController } from './product-review-processor.controller';

@Module({
  imports: [],
  controllers: [ProductReviewProcessorController],
})
export class ProductReviewProcessorModule { }
