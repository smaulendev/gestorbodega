import {
  Controller,
  Post,
  Body,
  HttpCode,
  Get,
  Query,
  Param,
} from '@nestjs/common';

import { InventarioService } from './inventario.service';

// DTOs
import { IngresarStockDto } from './dto/ingresar-stock.dto';
import { ConfirmarPickingDto } from './dto/confirmar-picking.dto';

@Controller('inventario')
export class InventarioController {
  constructor(private readonly inventarioService: InventarioService) {}

  // ============================================================
  // HU001 — INGRESAR STOCK (RECEPCIÓN)
  // ============================================================
  @Post('ingresar')
  @HttpCode(201)
  ingresarStock(@Body() dto: IngresarStockDto) {
    return this.inventarioService.ingresarStock(dto);
  }

  // ============================================================
  // INVENTARIO CONSOLIDADO GENERAL
  // ============================================================
  // ⚠ Ajuste importante: había dos GET() iguales → conflicto
  @Get('general')
  async obtenerInventario() {
    return this.inventarioService.obtenerInventarioGeneral();
  }

  // ============================================================
  // CONSULTA FILTRADA DE INVENTARIO (por producto, lote, bodega…)
  // ============================================================
  @Get('filtrar')
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

  // ============================================================
  // HU002 — FEFO: SUGERENCIA DE LOTE QUE VENCE PRIMERO
  // ============================================================
  @Get('fefo/:sku')
  async sugerenciaFefo(@Param('sku') sku: string) {
    return this.inventarioService.sugerirFefoPorSku(sku);
  }

  // ============================================================
  // HU002 — FEFO: CONFIRMAR PICKING FORZADO
  // ============================================================
  @Post('picking')
  async confirmarPicking(@Body() dto: ConfirmarPickingDto) {
    return this.inventarioService.confirmarPickingFefo(dto);
  }
}
