import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class UuidDto {
  @ApiProperty({
    description: 'Unique resource identificator',
  })
  @IsUUID(4)
  id: string;
}
