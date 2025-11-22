import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventario } from './entities/inventario.entity';
import { MovimientoInventario } from './entities/movimiento-inventario.entity';
import { Producto } from '../productos/entities/producto.entity';
import { Lote } from '../lotes/entities/lote.entity';
import { Bodega } from '../bodegas/entities/bodega.entity';
import { Ubicacion } from '../ubicaciones/entities/ubicacion.entity';
import { InventarioService } from './inventario.service';
import { InventarioController } from './inventario.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Inventario,
      MovimientoInventario,
      Producto,
      Lote,
      Bodega,
      Ubicacion,
    ]),
  ],
  controllers: [InventarioController],
  providers: [InventarioService],
  exports: [InventarioService],
})
export class InventarioModule {}
