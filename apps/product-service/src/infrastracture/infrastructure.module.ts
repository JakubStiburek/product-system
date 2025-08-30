import { Module } from '@nestjs/common';
import { ProductAdapter } from './product.adapter';
import { ReviewAdapter } from './review.adapter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { Review } from '../entities/review.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Review])],
  providers: [ProductAdapter, ReviewAdapter],
  exports: [ProductAdapter, ReviewAdapter],
})
export class InfrastructureModule {}
