import { Controller, Post, Body, HttpCode, Get, Query } from '@nestjs/common';
import { InventarioService } from './inventario.service';
import { IngresarStockDto } from './dto/ingresar-stock.dto';

@Controller('inventario')
export class InventarioController {
  constructor(private readonly inventarioService: InventarioService) {}

  @Post('ingresar')
  @HttpCode(201)
  ingresarStock(@Body() dto: IngresarStockDto) {
    return this.inventarioService.ingresarStock(dto);
  }
  

@Get()
async obtenerInventario() {
  return this.inventarioService.obtenerInventarioGeneral();
}

  @Get()
  getInventario(
    @Query('productoId') productoId?: string,
    @Query('bodegaId') bodegaId?: string,
    @Query('loteId') loteId?: string,
    @Query('estado') estado?: string,
  ) {
    return this.inventarioService.getInventario({
      productoId,
      bodegaId,
      loteId,
      estado,
    });
  }

}
