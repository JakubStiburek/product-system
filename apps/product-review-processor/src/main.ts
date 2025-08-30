import { NestFactory } from '@nestjs/core';
import { ProductReviewProcessorModule } from './product-review-processor.module';

async function bootstrap() {
  const app = await NestFactory.create(ProductReviewProcessorModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
