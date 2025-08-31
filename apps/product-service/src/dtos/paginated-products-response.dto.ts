import { ApiProperty } from '@nestjs/swagger';
import { ProductDto } from './create-product-response.dto';

export class PaginatedProductsResponseDto {
  @ApiProperty({
    description: 'List of products',
    type: [ProductDto],
  })
  data: ProductDto[];

  @ApiProperty({
    description: 'Total number of products',
  })
  total: number;

  @ApiProperty({
    description: 'Current page number',
  })
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
  })
  limit: number;

  @ApiProperty({
    description: 'Total number of pages',
  })
  totalPages: number;

  @ApiProperty({
    description: 'Whether there is a next page',
  })
  hasNext: boolean;

  @ApiProperty({
    description: 'Whether there is a previous page',
  })
  hasPrev: boolean;

  constructor(data: ProductDto[], total: number, page: number, limit: number) {
    this.data = data;
    this.total = total;
    this.page = page;
    this.limit = limit;
    this.totalPages = Math.ceil(total / limit);
    this.hasNext = page < this.totalPages;
    this.hasPrev = page > 1;
  }
}
