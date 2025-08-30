import {
  Controller,
  Post,
  Body,
  Inject,
  Put,
  Param,
  Get,
  Delete,
} from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { CreateProductUseCase } from './application/create-product.use-case';
import { UpdateProductUseCase } from './application/update-product.use-case';
import { GetProductUseCase } from './application/get-product.use-case';
import { DeleteProductUseCase } from './application/delete-product.use-case';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateProductResponseDto } from './dtos/create-product-response.dto';
import { UuidDto } from './common/dtos/uuid.dto';

@Controller('api/v1')
export class AppController {
  constructor(
    @Inject() private createProductUseCase: CreateProductUseCase,
    @Inject() private updateProductUseCase: UpdateProductUseCase,
    @Inject() private getProductUseCase: GetProductUseCase,
    @Inject() private deleteProductUseCase: DeleteProductUseCase,
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
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  async updateProduct(@Param() { id }: UuidDto, @Body() dto: UpdateProductDto) {
    return this.updateProductUseCase.execute(
      id,
      dto.name,
      dto.price,
      dto.description,
    );
  }

  @Get('products/:id')
  @ApiOperation({
    summary: 'Gets product by ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Product retrieved successfully',
    type: CreateProductResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  async getProduct(@Param() { id }: UuidDto) {
    return this.getProductUseCase.execute(id);
  }

  @Delete('products/:id')
  @ApiOperation({
    summary: 'Deletes product by ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Product deleted successfully',
  })
  async deleteProduct(@Param() { id }: UuidDto) {
    return this.deleteProductUseCase.execute(id);
  }
}
