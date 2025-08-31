import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductReviewAggregateAdapter } from './product-review-aggregate.adapter';
import { ProductReviewAggregate } from '../entities/product-review-aggregate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductReviewAggregate])],
  providers: [ProductReviewAggregateAdapter],
  exports: [ProductReviewAggregateAdapter],
})
export class InfrastructureModule {}
