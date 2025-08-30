import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ProductReviewProcessorModule } from './product-review-processor.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ProductReviewProcessorModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [
          process.env.RABBITMQ_URL || 'amqp://admin:password@localhost:5672',
        ],
        queue: 'product_review_events',
        queueOptions: {
          durable: false,
        },
      },
    },
  );
  await app.listen();
  console.log('Product Review Processor is running.');
}

bootstrap();
