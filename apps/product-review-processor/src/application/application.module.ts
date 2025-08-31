import { Module } from '@nestjs/common';
import { AddReviewUseCase } from './add-review.use-case';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductReviewAggregate } from '../entities/product-review-aggregate.entity';
import { RemoveReviewUseCase } from './remove-review.use-case';
import { UpdateReviewUseCase } from './update-review.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductReviewAggregate]),
    InfrastructureModule,
  ],
  providers: [AddReviewUseCase, RemoveReviewUseCase, UpdateReviewUseCase],
  exports: [AddReviewUseCase, RemoveReviewUseCase, UpdateReviewUseCase],
})
export class ApplicationModule { }
