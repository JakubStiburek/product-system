import { IsInt, IsNumber, Min, ValidateNested } from 'class-validator';
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

  @IsNumber()
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

  addReview(rating: number) {
    if (!this.isValidRating(rating)) {
      return;
    }

    this.reviewCount++;
    this.ratingSum = this.ratingSum + rating;
    this.averageRating = this.countAverageRating(
      this.ratingSum,
      this.reviewCount,
    );
  }

  removeReview(rating: number) {
    if (!this.isValidRating(rating) || !this.canRemoveReview(rating)) {
      return;
    }

    this.reviewCount--;
    this.ratingSum = this.ratingSum - rating;
    this.averageRating =
      this.reviewCount > 0
        ? this.countAverageRating(this.ratingSum, this.reviewCount)
        : 0;
  }

  private isValidRating(rating: number): boolean {
    return Number.isInteger(rating) && [1, 2, 3, 4, 5].includes(rating);
  }

  private canRemoveReview(rating: number): boolean {
    return this.reviewCount > 0 && this.ratingSum >= rating;
  }

  private countAverageRating(ratingSum: number, reviewCount: number) {
    return Number((ratingSum / reviewCount).toFixed(2));
  }
}
