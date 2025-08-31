import { Inject, Injectable } from '@nestjs/common';
import { Product as ProductDB } from '../entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductAdapter } from '../infrastracture/product.adapter';
import { CreateProductResponseDto } from '../dtos/create-product-response.dto';
import { ProductNotFoundException } from '../domain/products/product-not-found.exception';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Message } from '../common/rmq/message.enum';

@Injectable()
export class GetProductUseCase {
  constructor(
    @InjectRepository(ProductDB)
    private productRepository: Repository<ProductDB>,
    @Inject() private productAdapter: ProductAdapter,
    @Inject('PRODUCT_SERVICE') private rmqClient: ClientProxy,
  ) { }

  async execute(id: string) {
    const product = await this.productRepository.findOneBy({ id });

    if (!product) {
      throw new ProductNotFoundException(id);
    }

    const averageRatings = await firstValueFrom(
      // TODO: make this a VO
      this.rmqClient.send<{ productId: string; averageRating: number }[]>(
        Message.GET_AVERAGE_RATING,
        {
          productIds: [id],
        },
      ),
    );

    const domainProduct = this.productAdapter.toDomainEntity(
      product,
      averageRatings.find((item) => item.productId === product.id)
        ?.averageRating,
    );
    return CreateProductResponseDto.fromDomain(domainProduct);
  }
}
