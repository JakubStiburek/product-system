import { Controller, Post, Body, Inject } from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto';
import { CreateProductUseCase } from './application/create-product.use-case';
import { ApiOperation } from '@nestjs/swagger';

@Controller('api/v1')
export class AppController {
  constructor(@Inject() private createProductUseCase: CreateProductUseCase) {}

  @Post('products')
  @ApiOperation({
    summary: 'Creates new product',
  })
  async createProduct(@Body() dto: CreateProductDto) {
    return this.createProductUseCase.execute(
      dto.name,
      dto.price,
      dto.description,
    );
  }
}
