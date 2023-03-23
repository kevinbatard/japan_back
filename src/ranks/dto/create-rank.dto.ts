import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Length } from 'class-validator';

export class CreateRankDto {
  @ApiProperty()
  @IsString()
  @Length(1, 25)
  name: string;
}
