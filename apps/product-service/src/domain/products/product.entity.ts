import {
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { ValidatedClass } from '../../common/utils/validated-class';
import { ProductId } from './product-id.vo';

export class Product extends ValidatedClass {
  @ValidateNested()
  readonly id: ProductId;

  @IsString()
  name: string;

  @IsInt()
  @Min(0)
  price: number;

  @IsString()
  @IsOptional()
  description?: string;

  constructor(
    id: ProductId,
    name: string,
    price: number,
    description?: string,
  ) {
    super();
    this.id = id;
    this.name = name;
    this.price = price;
    this.description = description;
  }
}
