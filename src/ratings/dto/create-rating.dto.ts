import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { Regions } from 'src/regions/entities/region.entity';

export class CreateRatingDto {
  @ApiProperty()
  @IsNumber()
  rate: number;

  @ApiProperty()
  @IsNumber()
  region_id: Regions;
}
