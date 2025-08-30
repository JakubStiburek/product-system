import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductReviewProcessorService {
  getHello(): string {
    return 'Hello World!';
  }
}
