import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export enum SortProperty {
  RATING = 'rating',
  CREATED_AT = 'createdAt',
}

export enum SortDirection {
  DESC = 'DESC',
  ASC = 'ASC',
}

export class ListReviewsQueryDto {
  @ApiPropertyOptional({
    description: 'Sort result by property',
    enum: SortProperty,
    default: SortProperty.CREATED_AT,
  })
  @IsEnum(SortProperty)
  sortBy?: SortProperty = SortProperty.CREATED_AT;

  @ApiPropertyOptional({
    description: 'Sort result in direction',
    enum: SortDirection,
    default: SortDirection.DESC,
  })
  @IsEnum(SortDirection)
  sortDirection?: SortDirection = SortDirection.DESC;
}
