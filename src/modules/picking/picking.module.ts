import { Module } from '@nestjs/common';
import { PickingService } from './picking.service';
import { PickingController } from './picking.controller';

@Module({
  providers: [PickingService],
  controllers: [PickingController]
})
export class PickingModule {}
