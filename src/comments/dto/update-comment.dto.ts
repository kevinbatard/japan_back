import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';
import { CreateCommentDto } from './create-comment.dto';

export class UpdateCommentDto {
  @ApiProperty()
  @IsString()
  @Length(1, 8000)
  content: string;
}
