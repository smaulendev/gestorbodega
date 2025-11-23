import { Controller, Get, Query } from '@nestjs/common';
import { MovimientosService } from './movimientos.service';

@Controller('movimientos')
export class MovimientosController {
  constructor(private readonly movimientosService: MovimientosService) {}

  @Get()
  getMovimientos(
    @Query('productoId') productoId?: number,
    @Query('tipo') tipo?: string,
    @Query('fechaDesde') fechaDesde?: string,
    @Query('fechaHasta') fechaHasta?: string,
  ) {
    return this.movimientosService.getMovimientos({
      productoId,
      tipo,
      fechaDesde,
      fechaHasta,
    });
  }
}
