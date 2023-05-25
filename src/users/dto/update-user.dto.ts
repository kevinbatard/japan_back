import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { Ranks } from 'src/ranks/entities/rank.entity';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['pseudo']),
) {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  region_id: number;

  @ApiProperty()
  rank: Ranks;
}
