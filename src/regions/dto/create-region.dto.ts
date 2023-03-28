import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateRegionDto {
  @ApiProperty()
  @IsString()
  @Length(1, 25)
  name: string;

  @ApiProperty()
  @IsString()
  @Length(1, 500)
  description: string;
}
