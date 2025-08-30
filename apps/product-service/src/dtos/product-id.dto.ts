import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class ProductIdDto {
  @ApiProperty({
    description: 'Unique resource identificator',
  })
  @IsUUID(4)
  productId: string;
}
