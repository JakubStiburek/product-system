import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Review } from './entities/review.entity';
import { ApplicationModule } from './application/application.module';
import { HttpLoggerMiddleware } from './common/middleware/http-logger.middleware';
import { ReviewsController } from './reviews.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { FIVE_SECONDS_IN_MILIS } from './common/constants/time';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT || '5432'),
      username: process.env.POSTGRES_USER || 'admin',
      password: process.env.POSTGRES_PASSWORD || 'password',
      database: process.env.POSTGRES_DB || 'product_db',
      entities: [Product, Review],
      synchronize: process.env.POSTGRES_SYNC_ORM === 'true' || false,
    }),
    ApplicationModule,
    CacheModule.register({
      ttl: parseInt(
        process.env.DEFAULT_CACHE_TTL || `${FIVE_SECONDS_IN_MILIS}`,
      ),
    }),
  ],
  controllers: [ProductsController, ReviewsController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddleware).forRoutes('*'); // Apply the middleware to all routes
  }
}
