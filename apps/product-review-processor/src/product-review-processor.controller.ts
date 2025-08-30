import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class ProductReviewProcessorController {
  @EventPattern('event')
  handleEvent(@Payload() data: string) {
    console.log(data);
  }
}
