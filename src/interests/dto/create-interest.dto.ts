import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';
import { Category } from 'src/categories/entities/category.entity';

export class CreateInterestDto {
  @ApiProperty()
  @IsString()
  @Length(1, 8000)
  name: string;

  @ApiProperty()
  @IsString()
  @Length(1, 8000)
  adress: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  latitude: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  longitude: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  category: Category;

  @ApiProperty()
  @IsNumber()
  province_id: number;
}
