import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({
    description: 'Reviewer first name',
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'Reviewer last name',
  })
  @IsString()
  lastName: string;

  // TODO: make optional
  @ApiProperty({
    description: 'Review content',
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: 'Rating from 1 to 5',
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;
}
