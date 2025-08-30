import {
  Controller,
  Post,
  Body,
  Inject,
  Put,
  Param,
  Get,
  Delete,
  Query,
} from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { PaginationDto } from './dtos/pagination.dto';
import { CreateReviewDto } from './dtos/create-review.dto';
import { UpdateReviewDto } from './dtos/update-review.dto';
import { CreateProductUseCase } from './application/create-product.use-case';
import { UpdateProductUseCase } from './application/update-product.use-case';
import { GetProductUseCase } from './application/get-product.use-case';
import { DeleteProductUseCase } from './application/delete-product.use-case';
import { ListProductsUseCase } from './application/list-products.use-case';
import { CreateReviewUseCase } from './application/create-review.use-case';
import { UpdateReviewUseCase } from './application/update-review.use-case';
import { DeleteReviewUseCase } from './application/delete-review.use-case';
import { ListReviewsUseCase } from './application/list-reviews.use-case';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateProductResponseDto } from './dtos/create-product-response.dto';
import { PaginatedProductsResponseDto } from './dtos/paginated-products-response.dto';
import { CreateReviewResponseDto } from './dtos/create-review-response.dto';
import { PaginatedReviewsResponseDto } from './dtos/paginated-reviews-response.dto';
import { UuidDto } from './common/dtos/uuid.dto';
import { ProductIdDto } from './dtos/product-id.dto';
import { ReviewIdDto } from './dtos/review-id.dto';
import { ListReviewsQueryDto } from './dtos/list-reviews-query.dto';

@Controller('api/v1')
export class AppController {
  constructor(
    @Inject() private createProductUseCase: CreateProductUseCase,
    @Inject() private updateProductUseCase: UpdateProductUseCase,
    @Inject() private getProductUseCase: GetProductUseCase,
    @Inject() private deleteProductUseCase: DeleteProductUseCase,
    @Inject() private listProductsUseCase: ListProductsUseCase,
    @Inject() private createReviewUseCase: CreateReviewUseCase,
    @Inject() private updateReviewUseCase: UpdateReviewUseCase,
    @Inject() private deleteReviewUseCase: DeleteReviewUseCase,
    @Inject() private listReviewsUseCase: ListReviewsUseCase,
  ) {}

  @Get('products')
  @ApiOperation({
    summary: 'Lists products with pagination',
  })
  @ApiResponse({
    status: 200,
    description: 'Products retrieved successfully',
    type: PaginatedProductsResponseDto,
  })
  @ApiTags('product')
  async listProducts(@Query() pagination: PaginationDto) {
    return this.listProductsUseCase.execute(pagination.page, pagination.limit);
  }

  @Post('products')
  @ApiOperation({
    summary: 'Creates new product',
  })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    type: CreateProductResponseDto,
  })
  @ApiTags('product')
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
  @ApiTags('product')
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
  @ApiTags('product')
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
  @ApiTags('product')
  async deleteProduct(@Param() { id }: UuidDto) {
    return this.deleteProductUseCase.execute(id);
  }

  @Get('products/:id/reviews')
  @ApiOperation({
    summary: 'Lists reviews for a product with pagination',
  })
  @ApiResponse({
    status: 200,
    description: 'Reviews retrieved successfully',
    type: PaginatedReviewsResponseDto,
  })
  @ApiTags('review')
  async listReviews(
    @Param() { id }: UuidDto,
    @Query() pagination: PaginationDto,
    @Query() query: ListReviewsQueryDto,
  ) {
    return this.listReviewsUseCase.execute(
      id,
      pagination.page,
      pagination.limit,
      query,
    );
  }

  @Post('products/:id/reviews')
  @ApiOperation({
    summary: 'Creates new review for a product',
  })
  @ApiResponse({
    status: 201,
    description: 'Review created successfully',
    type: CreateReviewResponseDto,
  })
  @ApiTags('review')
  async createReview(@Param() { id }: UuidDto, @Body() dto: CreateReviewDto) {
    return this.createReviewUseCase.execute(
      id,
      dto.firstName,
      dto.lastName,
      dto.content,
      dto.rating,
    );
  }

  @Put('products/:productId/reviews/:reviewId')
  @ApiOperation({
    summary: 'Updates existing review',
  })
  @ApiResponse({
    status: 200,
    description: 'Review updated successfully',
    type: CreateReviewResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Review not found',
  })
  @ApiTags('review')
  async updateReview(
    @Param() { productId }: ProductIdDto,
    @Param() { reviewId }: ReviewIdDto,
    @Body() dto: UpdateReviewDto,
  ) {
    return this.updateReviewUseCase.execute(
      productId,
      reviewId,
      dto.firstName,
      dto.lastName,
      dto.content,
      dto.rating,
    );
  }

  @Delete('products/:productId/reviews/:reviewId')
  @ApiOperation({
    summary: 'Deletes review by ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Review deleted successfully',
  })
  @ApiTags('review')
  async deleteReview(
    @Param() { productId }: ProductIdDto,
    @Param() { reviewId }: ReviewIdDto,
  ) {
    return this.deleteReviewUseCase.execute(productId, reviewId);
  }
}
