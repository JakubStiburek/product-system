import { Module } from '@nestjs/common';
import { ProductReviewProcessorController } from './product-review-processor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductReviewAggregate } from './entities/product-review-aggregate.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      host: process.env.MONGO_INITDB_HOST || 'mongodb',
      port: parseInt(process.env.MONGO_INITDB_PORT || '27017'),
      username: process.env.MONGO_INITDB_ROOT_USERNAME || 'admin',
      password: process.env.MONGO_INITDB_ROOT_PASSWORD || 'password',
      database:
        process.env.MONGO_INITDB_DATABASE || 'product_review_aggregate_db',
      authSource: 'admin',
      entities: [ProductReviewAggregate],
      synchronize: process.env.MONGO_INITDB_SYNC_ORM === 'true' || false,
    }),
  ],
  controllers: [ProductReviewProcessorController],
})
export class ProductReviewProcessorModule { }
