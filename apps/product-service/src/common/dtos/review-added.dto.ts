import { IsInt, Max, Min, ValidateNested } from 'class-validator';
import { ValidatedClass } from '../utils/validated-class';
import { ProductId } from '../../domain/products/product-id.vo';

export class ReviewAddedDto extends ValidatedClass {
  @ValidateNested()
  readonly productId: ProductId;

  @IsInt()
  @Min(1)
  @Max(5)
  readonly rating: number;

  constructor(productId: ProductId, rating: number) {
    super();
    this.productId = productId;
    this.rating = rating;
  }
}
