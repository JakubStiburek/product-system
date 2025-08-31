import { Module } from '@nestjs/common';
import { ReviewAddedUseCase } from './review-added.use-case';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductReviewAggregate } from '../entities/product-review-aggregate.entity';
import { ReviewRemovedUseCase } from './review-removed.use-case';
import { ReviewUpdatedUseCase } from './review-updated.use-case';
import { ProductDeletedUseCase } from './product-deleted.use-case';
import { GetAverageRatingUseCase } from './get-average-rating.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductReviewAggregate]),
    InfrastructureModule,
  ],
  providers: [
    ReviewAddedUseCase,
    ReviewRemovedUseCase,
    ReviewUpdatedUseCase,
    ProductDeletedUseCase,
    GetAverageRatingUseCase,
  ],
  exports: [
    ReviewAddedUseCase,
    ReviewRemovedUseCase,
    ReviewUpdatedUseCase,
    ProductDeletedUseCase,
    GetAverageRatingUseCase,
  ],
})
export class ApplicationModule {}
