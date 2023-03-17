import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Length } from 'class-validator';

export class CreateInterestDto {
  @ApiProperty()
  @IsString()
  @Length(1, 8000)
  name: string;

  @ApiProperty()
  @IsString()
  @Length(1, 8000)
  category: string;

  @ApiProperty()
  @IsString()
  @Length(1, 8000)
  adress: string;

  @ApiProperty()
  @IsNumber()
  province_id: number;
}
