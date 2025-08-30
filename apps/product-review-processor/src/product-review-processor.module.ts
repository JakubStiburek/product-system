import { Module } from '@nestjs/common';
import { ProductReviewProcessorController } from './product-review-processor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      host: process.env.MONGO_INITDB_HOST || 'localhost',
      port: parseInt(process.env.MONGO_INITDB_PORT || '27017'),
      username: process.env.MONGO_INITDB_ROOT_USERNAME || 'admin',
      password: process.env.MONGO_INITDB_ROOT_PASSWORD || 'password',
      database:
        process.env.MONGO_INITDB_DATABASE || 'product_review_aggregate_db',
      entities: [],
      synchronize: true,
    }),
  ],
  controllers: [ProductReviewProcessorController],
})
export class ProductReviewProcessorModule { }
