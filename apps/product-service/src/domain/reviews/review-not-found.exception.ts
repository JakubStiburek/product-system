import { NotFoundException } from '@nestjs/common';

export class ReviewNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`Review with ID ${id} not found`);
  }
}
