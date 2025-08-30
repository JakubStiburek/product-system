import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { Review } from '../entities/review.entity';
import { CreateProductUseCase } from './create-product.use-case';
import { UpdateProductUseCase } from './update-product.use-case';
import { GetProductUseCase } from './get-product.use-case';
import { DeleteProductUseCase } from './delete-product.use-case';
import { ListProductsUseCase } from './list-products.use-case';
import { CreateReviewUseCase } from './create-review.use-case';
import { UpdateReviewUseCase } from './update-review.use-case';
import { DeleteReviewUseCase } from './delete-review.use-case';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { InfrastructureModule } from '../infrastracture/infrastructure.module';

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
export class ApplicationModule {}
