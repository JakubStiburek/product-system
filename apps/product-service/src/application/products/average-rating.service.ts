import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ProductId } from '../../domain/products/product-id.vo';
import { Message } from '../../common/rmq/message.enum';
import { firstValueFrom } from 'rxjs';
import { Cache } from '@nestjs/cache-manager';

@Injectable()
export class AverageRatingService {
  constructor(
    @Inject('PRODUCT_SERVICE') private rmqClient: ClientProxy,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getAverageRatings(productIds: ProductId[]) {
    if (productIds.length === 0) {
      return [];
    }

    const { cachedRatings, uncachedProductIds } =
      await this.getCachedAverageRatings(productIds);

    if (uncachedProductIds.length === 0) {
      return cachedRatings;
    }

    const freshRatings = await this.getFreshAverageRatings(uncachedProductIds);
    await this.cacheAverageRatings(freshRatings);

    return [...cachedRatings, ...freshRatings];
  }

  private async getFreshAverageRatings(productIds: ProductId[]) {
    return await firstValueFrom(
      this.rmqClient.send<{ productId: string; averageRating: number }[]>(
        Message.GET_AVERAGE_RATING,
        {
          productIds: productIds.map((id) => id.value),
        },
      ),
    );
  }

  private async getCachedAverageRatings(productIds: ProductId[]) {
    const cachedRatings: { productId: string; averageRating: number }[] = [];
    const uncachedProductIds: ProductId[] = [];

    for (const productId of productIds) {
      const cacheKey = AverageRatingService.buildCacheKey(productId);
      const cachedRating = await this.cacheManager.get<number>(cacheKey);

      if (cachedRating !== undefined) {
        cachedRatings.push({
          productId: productId.value,
          averageRating: cachedRating,
        });
      } else {
        uncachedProductIds.push(productId);
      }
    }

    return { cachedRatings, uncachedProductIds };
  }

  private async cacheAverageRatings(
    ratings: { productId: string; averageRating: number }[],
  ) {
    const promises = ratings.map(async (rating) => {
      const productId = ProductId.create(rating.productId);
      const cacheKey = AverageRatingService.buildCacheKey(productId);
      await this.cacheManager.set(cacheKey, rating.averageRating);
    });

    await Promise.all(promises);
  }

  static buildCacheKey(productId: ProductId) {
    return `products:${productId.value}`;
  }
}
