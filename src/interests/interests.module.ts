import { Module } from '@nestjs/common';
import { InterestsService } from './interests.service';
import { InterestsController } from './interests.controller';
import { RegionsService } from 'src/regions/regions.service';

@Module({
  controllers: [InterestsController],
  providers: [InterestsService, RegionsService],
})
export class InterestsModule {}
