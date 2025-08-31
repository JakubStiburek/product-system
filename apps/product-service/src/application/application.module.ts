import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { Review } from '../entities/review.entity';
import { UpdateProductUseCase } from './products/update-product.use-case';
import { GetProductUseCase } from './products/get-product.use-case';
import { DeleteProductUseCase } from './products/delete-product.use-case';
import { ListProductsUseCase } from './products/list-products.use-case';
import { CreateReviewUseCase } from './reviews/create-review.use-case';
import { UpdateReviewUseCase } from './reviews/update-review.use-case';
import { DeleteReviewUseCase } from './reviews/delete-review.use-case';
import { ListReviewsUseCase } from './reviews/list-reviews.use-case';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { InfrastructureModule } from '../infrastracture/infrastructure.module';
import { CreateProductUseCase } from './products/create-product.use-case';

@Module({
  providers: [
    CreateProductUseCase,
    UpdateProductUseCase,
    GetProductUseCase,
    DeleteProductUseCase,
    ListProductsUseCase,
    CreateReviewUseCase,
    UpdateReviewUseCase,
    DeleteReviewUseCase,
    ListReviewsUseCase,
  ],
  exports: [
    CreateProductUseCase,
    UpdateProductUseCase,
    GetProductUseCase,
    DeleteProductUseCase,
    ListProductsUseCase,
    CreateReviewUseCase,
    UpdateReviewUseCase,
    DeleteReviewUseCase,
    ListReviewsUseCase,
  ],
  imports: [
    ClientsModule.register([
      {
        name: 'PRODUCT_SERVICE',
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
    ]),
    TypeOrmModule.forFeature([Product, Review]),
    InfrastructureModule,
  ],
})
export class ApplicationModule { }
