import { Test, TestingModule } from '@nestjs/testing';
import { ProductReviewProcessorController } from './product-review-processor.controller';
import { ProductReviewProcessorService } from './product-review-processor.service';

describe('ProductReviewProcessorController', () => {
  let productReviewProcessorController: ProductReviewProcessorController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ProductReviewProcessorController],
      providers: [ProductReviewProcessorService],
    }).compile();

    productReviewProcessorController = app.get<ProductReviewProcessorController>(ProductReviewProcessorController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(productReviewProcessorController.getHello()).toBe('Hello World!');
    });
  });
});
