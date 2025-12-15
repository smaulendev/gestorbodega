// src/modules/reportes/reportes.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportesController } from './reportes.controller';
import { ReportesService } from './reportes.service';
import { Inventario } from '../inventario/entities/inventario.entity';
import { MovimientoInventario } from '../inventario/entities/movimiento-inventario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Inventario, MovimientoInventario])],
  controllers: [ReportesController],
  providers: [ReportesService],
})
export class ReportesModule {}
