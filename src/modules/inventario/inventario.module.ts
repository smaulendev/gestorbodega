// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { Inventario } from './entities/inventario.entity';

// @Module({
//   imports: [TypeOrmModule.forFeature([Inventario])],
//   exports: [TypeOrmModule],
// })
// export class InventarioModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventario } from './entities/inventario.entity';
import { InventarioService } from './inventario.service';
import { InventarioController } from './inventario.controller';
import { Producto } from '../productos/entities/producto.entity';
import { Lote } from '../lotes/entities/lote.entity';
import { Bodega } from '../bodegas/entities/bodega.entity';
import { Ubicacion } from '../ubicaciones/entities/ubicacion.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Inventario, Producto, Lote, Bodega, Ubicacion]),
  ],
  controllers: [InventarioController],
  providers: [InventarioService],
})
export class InventarioModule {}
