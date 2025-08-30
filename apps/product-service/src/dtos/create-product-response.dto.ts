import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Product } from '../domain/products/product.entity';

export class CreateProductResponseDto {
  @ApiProperty({ description: 'Unique identifier' })
  id: string;

  @ApiProperty({
    description: 'Product name',
  })
  name: string;

  @ApiProperty({
    description: 'Product price (in cents)',
  })
  price: number;

  @ApiPropertyOptional({
    description: 'Product description',
  })
  description?: string;

  constructor(dto: Partial<CreateProductResponseDto>) {
    Object.assign(this, dto);
  }

  static fromDomain(product: Product) {
    return new CreateProductResponseDto({ ...product, id: product.id.value });
  }
}
