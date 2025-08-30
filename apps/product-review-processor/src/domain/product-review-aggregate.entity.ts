import { IsInt, Min, ValidateNested } from 'class-validator';
import { ValidatedClass } from '../common/utils/validated-class';
import { ProductReviewAggregateId } from './product-review-aggregate-id.vo';
import { ProductId } from './product-id.vo';

export class ProductReviewAggregate extends ValidatedClass {
  @ValidateNested()
  id: ProductReviewAggregateId;

  @ValidateNested()
  productId: ProductId;

  @IsInt()
  @Min(1)
  reviewCount: number;

  @IsInt()
  @Min(1)
  ratingSum: number;

  @IsInt()
  @Min(1)
  averageRating: number;

  constructor(
    id: ProductReviewAggregateId,
    productId: ProductId,
    reviewCount: number,
    ratingSum: number,
    averageRating: number,
  ) {
    super();
    this.id = id;
    this.productId = productId;
    this.reviewCount = reviewCount;
    this.ratingSum = ratingSum;
    this.averageRating = averageRating;
  }
}
