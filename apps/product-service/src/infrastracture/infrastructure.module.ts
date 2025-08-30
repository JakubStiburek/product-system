import { Module } from '@nestjs/common';
import { ProductAdapter } from './product.adapter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  providers: [ProductAdapter],
  exports: [ProductAdapter],
})
export class InfrastructureModule {}
