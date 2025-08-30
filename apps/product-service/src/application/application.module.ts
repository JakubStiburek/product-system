import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductUseCase } from './create-product.use-case';
import { UpdateProductUseCase } from './update-product.use-case';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { InfrastructureModule } from '../infrastracture/infrastructure.module';

@Module({
  providers: [CreateProductUseCase, UpdateProductUseCase],
  exports: [CreateProductUseCase, UpdateProductUseCase],
  imports: [
    ClientsModule.register([
      {
        name: 'PRODUCT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [
            process.env.RABBITMQ_URL || 'amqp://admin:password@localhost:5672',
          ],
          queue: 'product_review_events',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    TypeOrmModule.forFeature([Product]),
    InfrastructureModule,
  ],
})
export class ApplicationModule {}
