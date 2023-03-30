import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { Regions } from 'src/regions/entities/region.entity';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['pseudo']),
) {
  @ApiProperty()
  @IsNumber()
  region_id: number;
}
