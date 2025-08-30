import { IsString } from 'class-validator';
import { ValidatedClass } from '../common/utils/validated-class';

export class ProductReviewAggregateId extends ValidatedClass {
  @IsString()
  readonly value: string;

  constructor(value: string) {
    super();
    this.value = value;
  }
}
