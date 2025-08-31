import { Event } from '../common/rmq/event.enum';
import { Inject, Injectable } from '@nestjs/common';
import { Product as ProductDB } from '../entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class DeleteProductUseCase {
  constructor(
    @InjectRepository(ProductDB)
    private productRepository: Repository<ProductDB>,
    @Inject('PRODUCT_SERVICE') private rmqClient: ClientProxy,
  ) { }

  async execute(id: string): Promise<void> {
    await this.productRepository.delete(id);
    this.rmqClient.emit(Event.PRODUCT_DELETED, { productId: id });
  }
}
