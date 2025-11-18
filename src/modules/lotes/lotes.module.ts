import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LotesService } from './lotes.service';
import { LotesController } from './lotes.controller';
import { Lote } from './entities/lote.entity';
import { Producto } from '../productos/entities/producto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lote, Producto])],
  controllers: [LotesController],
  providers: [LotesService],
  exports: [TypeOrmModule],
})
export class LotesModule {}
