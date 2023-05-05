import { PartialType } from '@nestjs/swagger';
import { CreateInterestDto } from './create-interest.dto';
import { IsOptional } from 'class-validator';
import { Category } from 'src/categories/entities/category.entity';

export class UpdateInterestDto extends PartialType(CreateInterestDto) {
  @IsOptional()
  name: string;

  @IsOptional()
  adress: string;

  @IsOptional()
  latitude: number;

  @IsOptional()
  longitude: number;

  @IsOptional()
  category: Category;
}
