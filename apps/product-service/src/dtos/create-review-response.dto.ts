import { ApiProperty } from '@nestjs/swagger';
import { Review } from '../domain/reviews/review.entity';

export class CreateReviewResponseDto {
  @ApiProperty({ description: 'Unique identifier' })
  id: string;

  @ApiProperty({
    description: 'Product ID',
  })
  productId: string;

  @ApiProperty({
    description: 'Reviewer first name',
  })
  firstName: string;

  @ApiProperty({
    description: 'Reviewer last name',
  })
  lastName: string;

  @ApiProperty({
    description: 'Review content',
  })
  content: string;

  @ApiProperty({
    description: 'Rating from 1 to 5',
  })
  rating: number;

  constructor(dto: Partial<CreateReviewResponseDto>) {
    Object.assign(this, dto);
  }

  static fromDomain(review: Review) {
    return new CreateReviewResponseDto({
      ...review,
      id: review.id.value,
      productId: review.productId.value,
    });
  }
}
