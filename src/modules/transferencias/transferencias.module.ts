import { Module } from '@nestjs/common';
import { TransferenciasService } from './transferencias.service';
import { TransferenciasController } from './transferencias.controller';

@Module({
  providers: [TransferenciasService],
  controllers: [TransferenciasController]
})
export class TransferenciasModule {}
