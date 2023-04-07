import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetRegionDto {
  @ApiProperty()
  @IsString()
  name: string;
}
