import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Product as ProductDB } from '../entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductAdapter } from '../infrastracture/product.adapter';
import { CreateProductResponseDto } from '../dtos/create-product-response.dto';

@Injectable()
export class UpdateProductUseCase {
  constructor(
    @InjectRepository(ProductDB)
    private productRepository: Repository<ProductDB>,
    @Inject() private productAdapter: ProductAdapter,
  ) {}

  async execute(
    id: string,
    name?: string,
    price?: number,
    description?: string,
  ) {
    const existingProduct = await this.productRepository.findOneBy({ id });

    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }

    const product = this.productAdapter.toDomainEntity(existingProduct);

    const propertiesToUpdate = {
      name,
      price,
      description,
    };

    if (Object.keys(propertiesToUpdate).length === 0) {
      return product;
    }

    product.update(propertiesToUpdate);

    await this.productRepository.save([
      this.productAdapter.toDBEntity(product),
    ]);

    return CreateProductResponseDto.fromDomain(product);
  }
}
