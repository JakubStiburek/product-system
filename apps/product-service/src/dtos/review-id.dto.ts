import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class ReviewIdDto {
  @ApiProperty({
    description: 'Unique resource identificator',
  })
  @IsUUID(4)
  reviewId: string;
}
