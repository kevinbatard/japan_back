import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { ProvincesService } from 'src/provinces/provinces.service';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService, ProvincesService],
})
export class CommentsModule {}
