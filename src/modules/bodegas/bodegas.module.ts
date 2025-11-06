import { Module } from '@nestjs/common';
import { BodegasService } from './bodegas.service';
import { BodegasController } from './bodegas.controller';

@Module({
  providers: [BodegasService],
  controllers: [BodegasController]
})
export class BodegasModule {}
