import { IsUUID } from 'class-validator';
import { ValidatedClass } from '../../common/utils/validated-class';

export class ProductId extends ValidatedClass {
  @IsUUID(4)
  readonly value: string;

  constructor(value: string) {
    super();
    this.value = value;
  }
}
