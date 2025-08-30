import { NestFactory } from '@nestjs/core';
import { AppModule } from './product-service.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Product System')
    .setDescription('API for manipulating products and reviews')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Product Service running on port: ${port}`);
}
bootstrap();
