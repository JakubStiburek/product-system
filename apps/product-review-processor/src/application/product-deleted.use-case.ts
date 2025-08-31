import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductReviewAggregate as ProductReviewAggregateDB } from '../entities/product-review-aggregate.entity';
import { Repository } from 'typeorm';
import { ProductId } from '../domain/product-id.vo';

@Injectable()
export class ProductDeletedUseCase {
  constructor(
    @InjectRepository(ProductReviewAggregateDB)
    private repository: Repository<ProductReviewAggregateDB>,
  ) { }

  async execute(productId: ProductId) {
    await this.repository.delete({ productId: productId.value });
  }
}
