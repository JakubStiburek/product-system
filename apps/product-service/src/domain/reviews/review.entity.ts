import { IsInt, IsString, Max, Min, ValidateNested } from 'class-validator';
import { ValidatedClass } from '../../common/utils/validated-class';
import { ReviewId } from './review-id.vo';
import { ProductId } from '../products/product-id.vo';

export interface UpdateReviewPayload {
  firstName?: string;
  lastName?: string;
  content?: string;
  rating?: number;
}

export class Review extends ValidatedClass {
  @ValidateNested()
  readonly id: ReviewId;

  @ValidateNested()
  readonly productId: ProductId;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  content: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  constructor(
    id: ReviewId,
    productId: ProductId,
    firstName: string,
    lastName: string,
    content: string,
    rating: number,
  ) {
    super();
    this.id = id;
    this.productId = productId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.content = content;
    this.rating = rating;
  }

  update({ firstName, lastName, content, rating }: UpdateReviewPayload) {
    if (firstName && firstName !== this.firstName) {
      this.firstName = firstName;
    }

    if (lastName && lastName !== this.lastName) {
      this.lastName = lastName;
    }

    if (content && content !== this.content) {
      this.content = content;
    }

    if (rating && rating !== this.rating) {
      this.rating = rating;
    }

    ValidatedClass.validateInstance(this);
  }
}
