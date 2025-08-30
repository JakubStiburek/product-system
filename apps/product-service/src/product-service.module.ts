import { Module } from '@nestjs/common';
import { AppController } from './product-service.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Review } from './entities/review.entity';
import { ApplicationModule } from './application/application.module';

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
  ],
  controllers: [AppController],
})
export class AppModule {}
