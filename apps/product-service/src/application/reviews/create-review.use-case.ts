import { Inject, Injectable } from '@nestjs/common';
import { Review } from '../../domain/reviews/review.entity';
import { Review as ReviewDB } from '../../entities/review.entity';
import { Product as ProductDB } from '../../entities/product.entity';
import { ReviewId } from '../../domain/reviews/review-id.vo';
import { ProductId } from '../../domain/products/product-id.vo';
import { v4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReviewAdapter } from '../../infrastracture/review.adapter';
import { CreateReviewResponseDto } from '../../dtos/create-review-response.dto';
import { ClientProxy } from '@nestjs/microservices';
import { Event } from '../../common/rmq/event.enum';
import { ReviewUpdateDto } from '../../common/dtos/review-update.dto';
import { DateTime } from 'luxon';
import { ProductNotFoundException } from '../../domain/products/product-not-found.exception';

@Injectable()
export class CreateReviewUseCase {
  constructor(
    @InjectRepository(ReviewDB)
    private reviewRepository: Repository<ReviewDB>,
    @InjectRepository(ProductDB)
    private productRepository: Repository<ProductDB>,
    @Inject() private reviewAdapter: ReviewAdapter,
    @Inject('PRODUCT_SERVICE') private rmqClient: ClientProxy,
  ) {}

  async execute(
    productIdRaw: string,
    firstName: string,
    lastName: string,
    content: string,
    rating: number,
  ) {
    const productId = ProductId.create(productIdRaw);

    const productDB = await this.productRepository.findOneBy({
      id: productId.value,
    });

    if (!productDB) {
      throw new ProductNotFoundException(productId.value);
    }

    const review = Review.create(
      ReviewId.create(v4()),
      productId,
      firstName,
      lastName,
      content,
      rating,
    );

    await this.reviewRepository.save({
      ...this.reviewAdapter.toDBEntity(review),
      createdAt: DateTime.now().toUTC().toJSDate(),
      updatedAt: DateTime.now().toUTC().toJSDate(),
    });

    this.rmqClient.emit(
      Event.REVIEW_ADDED,
      ReviewUpdateDto.create(productId, review.rating),
    );

    return CreateReviewResponseDto.fromDomain(review);
  }
}
