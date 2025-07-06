import { Module } from '@nestjs/common';
import { GuidelineService } from './guideline.service';

@Module({
  providers: [GuidelineService],
  exports: [GuidelineService],
})
export class GuidelineModule {}
