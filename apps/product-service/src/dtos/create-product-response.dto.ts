import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Product } from '../domain/products/product.entity';

export class ProductDto {
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

  @ApiPropertyOptional({
    description: 'Average rating if any reviews have been added to the product',
  })
  averageRating?: number;

  constructor(dto: Partial<ProductDto>) {
    Object.assign(this, dto);
  }

  static fromDomain(product: Product) {
    return new ProductDto({ ...product, id: product.id.value });
  }
}
