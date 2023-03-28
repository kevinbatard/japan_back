import { ApiProperty } from '@nestjs/swagger';
import { OmitType, PartialType } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';
import { CreateRegionDto } from './create-region.dto';

export class UpdateRegionDto extends PartialType(
  OmitType(CreateRegionDto, ['name']),
) {
  @ApiProperty()
  @IsString()
  @Length(1, 500)
  description: string;
}
