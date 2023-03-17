import { Module } from '@nestjs/common';
import { InterestsService } from './interests.service';
import { InterestsController } from './interests.controller';
import { ProvincesService } from 'src/provinces/provinces.service';

@Module({
  controllers: [InterestsController],
  providers: [InterestsService, ProvincesService],
})
export class InterestsModule {}
