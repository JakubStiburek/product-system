import { IsBoolean, IsInt, Max, Min, ValidateNested } from 'class-validator';
import { ValidatedClass } from '../common/utils/validated-class';
import { ProductId } from '../domain/product-id.vo';

export class ReviewAggregateUpdateDto extends ValidatedClass {
  @ValidateNested()
  readonly productId: ProductId;

  @IsInt()
  @Min(1)
  @Max(5)
  readonly rating: number;

  @IsBoolean()
  readonly shouldAddToSum: boolean;

  constructor(productId: ProductId, rating: number, shouldAddToSum: boolean) {
    super();
    this.productId = productId;
    this.rating = rating;
    this.shouldAddToSum = shouldAddToSum;
  }
}
