import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ubicacion } from './entities/ubicacion.entity';
import { UbicacionesService } from './ubicaciones.service';
import { UbicacionesController } from './ubicaciones.controller';
import { Bodega } from '../bodegas/entities/bodega.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ubicacion, Bodega])],
  controllers: [UbicacionesController],
  providers: [UbicacionesService],
  exports: [UbicacionesService],
})
export class UbicacionesModule {}
