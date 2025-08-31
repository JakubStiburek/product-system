import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { ValidatedClass } from '../utils/validated-class';
import { ProductId } from '../../domain/products/product-id.vo';

export class ReviewUpdateDto extends ValidatedClass {
  @IsUUID(4)
  readonly productId: string;

  @IsInt()
  @Min(1)
  @Max(5)
  readonly rating: number;

  @IsOptional()
  @IsBoolean()
  shouldAddToSum?: boolean;

  constructor(productId: ProductId, rating: number, shouldAddToSum?: boolean) {
    super();
    this.productId = productId.value;
    this.rating = rating;
    this.shouldAddToSum = shouldAddToSum;
  }
}
