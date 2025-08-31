import { Module } from '@nestjs/common';
import { AddReviewUseCase } from './add-review.use-case';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductReviewAggregate } from '../entities/product-review-aggregate.entity';
import { RemoveReviewUseCase } from './remove-review.use-case';
import { UpdateReviewUseCase } from './update-review.use-case';
import { ProductDeletedUseCase } from './product-deleted.use-case';
import { GetAverageRatingUseCase } from './get-average-rating.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductReviewAggregate]),
    InfrastructureModule,
  ],
  providers: [
    AddReviewUseCase,
    RemoveReviewUseCase,
    UpdateReviewUseCase,
    ProductDeletedUseCase,
    GetAverageRatingUseCase,
  ],
  exports: [
    AddReviewUseCase,
    RemoveReviewUseCase,
    UpdateReviewUseCase,
    ProductDeletedUseCase,
    GetAverageRatingUseCase,
  ],
})
export class ApplicationModule {}
