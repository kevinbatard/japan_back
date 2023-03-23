import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { RegionsService } from 'src/regions/regions.service';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService, RegionsService],
})
export class CommentsModule {}
