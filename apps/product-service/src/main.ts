import { NestFactory } from '@nestjs/core';
import { AppModule } from './product-service.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Product Service running on port: ${port}`);
}
bootstrap();
