import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(@Inject('PRODUCT_SERVICE') private rmqClient: ClientProxy) { }

  @Get()
  getHello() {
    this.rmqClient.emit('event', 'This is a hello from api');
  }
}
