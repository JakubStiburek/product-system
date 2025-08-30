import { Controller, Post, Body, Inject, Put, Param } from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { CreateProductUseCase } from './application/create-product.use-case';
import { UpdateProductUseCase } from './application/update-product.use-case';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateProductResponseDto } from './dtos/create-product-response.dto';

@Controller('api/v1')
export class AppController {
  constructor(
    @Inject() private createProductUseCase: CreateProductUseCase,
    @Inject() private updateProductUseCase: UpdateProductUseCase,
  ) {}

  @Post('products')
  @ApiOperation({
    summary: 'Creates new product',
  })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    type: CreateProductResponseDto,
  })
  async createProduct(@Body() dto: CreateProductDto) {
    return this.createProductUseCase.execute(
      dto.name,
      dto.price,
      dto.description,
    );
  }

  @Put('products/:id')
  @ApiOperation({
    summary: 'Updates existing product',
  })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully',
    type: CreateProductResponseDto,
  })
  async updateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.updateProductUseCase.execute(
      id,
      dto.name,
      dto.price,
      dto.description,
    );
  }
}
