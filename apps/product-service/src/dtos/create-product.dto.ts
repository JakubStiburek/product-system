import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product name',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Product price (in cents)',
  })
  @IsInt()
  @Min(0)
  price: number;

  @ApiPropertyOptional({
    description: 'Product description',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
