import { Injectable } from '@nestjs/common';
import { Product as ProductDB } from '../entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class DeleteProductUseCase {
  constructor(
    @InjectRepository(ProductDB)
    private productRepository: Repository<ProductDB>,
  ) {}

  async execute(id: string): Promise<void> {
    await this.productRepository.delete(id);
  }
}

