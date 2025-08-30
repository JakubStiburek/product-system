import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ProductReviewAggregate } from '../domain/product-review-aggregate.entity';
import { ProductReviewAggregate as ProductReviewAggregateDB } from '../entities/product-review-aggregate.entity';
import { ProductReviewAggregateId } from '../domain/product-review-aggregate-id.vo';
import { ProductId } from '../domain/product-id.vo';

@Injectable()
export class ProductReviewAggregateAdapter {
  constructor(
    @InjectRepository(ProductReviewAggregateDB)
    private aggregateRepository: MongoRepository<ProductReviewAggregateDB>,
  ) {}

  toDBEntity(aggregate: ProductReviewAggregate): ProductReviewAggregateDB {
    return this.aggregateRepository.create({
      _id: aggregate.id.value,
      productId: aggregate.productId.value,
      reviewCount: aggregate.reviewCount,
      ratingSum: aggregate.ratingSum,
      averageRating: aggregate.averageRating,
    });
  }

  toDomainEntity(
    aggregateDB: ProductReviewAggregateDB,
  ): ProductReviewAggregate {
    return ProductReviewAggregate.create(
      ProductReviewAggregateId.create(aggregateDB._id.toString()),
      ProductId.create(aggregateDB.productId),
      aggregateDB.reviewCount,
      aggregateDB.ratingSum,
      aggregateDB.averageRating,
    );
  }
}

