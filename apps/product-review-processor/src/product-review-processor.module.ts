import { Module } from '@nestjs/common';
import { ProductReviewProcessorController } from './product-review-processor.controller';
import { ProductReviewProcessorService } from './product-review-processor.service';

@Module({
  imports: [],
  controllers: [ProductReviewProcessorController],
  providers: [ProductReviewProcessorService],
})
export class ProductReviewProcessorModule {}
