import {
  Controller,
  Post,
  Body,
  Patch,
  HttpCode,
  Get,
  Query,
  Param,
  Res,
} from '@nestjs/common';

import type { Response } from 'express';
import { Parser } from 'json2csv';

import { InventarioService } from './inventario.service';

// DTOs
import { IngresarStockDto } from './dto/ingresar-stock.dto';
import { ConfirmarPickingDto } from './dto/confirmar-picking.dto';
import { AjustarStockDto } from './dto/ajustar-stock.dto';


@Controller('inventario')
export class InventarioController {
  constructor(private readonly inventarioService: InventarioService) {}

  // ============================================================
  // HU001 — INGRESAR STOCK
  // ============================================================
  @Post('ingresar')
  @HttpCode(201)
  ingresarStock(@Body() dto: IngresarStockDto) {
    return this.inventarioService.ingresarStock(dto);
  }

  // ============================================================
  // INVENTARIO GENERAL (JSON)
  // ============================================================
  @Get('general')
  async obtenerInventario() {
    return this.inventarioService.obtenerInventarioGeneral();
  }

  // ============================================================
  // EXPORTACIÓN — CSV (inventario general)
  // ============================================================
  @Get('export')
  async exportarInventarioGeneral(@Res() res: Response) {
    const data = await this.inventarioService.obtenerInventarioGeneral();

    const rows = data.map((inv) => ({
      producto: inv.producto.nombre,
      sku: inv.producto.sku,
      lote: inv.lote.codigoLote,
      caducidad: inv.lote.fechaCaducidad,
      bodega: inv.bodega.nombre,
      ubicacion: inv.ubicacion.nombre, // asegurado que existe
      cantidad: inv.cantidad,
      disponible: inv.cantidadDisponible,
      reservado: inv.cantidadReservada,
      transito: inv.cantidadTransito,
      estado: inv.estadoStock,
    }));

    const parser = new Parser();
    const csv = parser.parse(rows);

    res.header('Content-Type', 'text/csv');
    res.attachment('inventario-general.csv');
    return res.send(csv);
  }

  // ============================================================
  // CONSULTA FILTRADA
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
  // FEFO — SUGERENCIA DE LOTE
  // ============================================================
  @Get('fefo/:sku')
  async sugerenciaFefo(@Param('sku') sku: string) {
    return this.inventarioService.sugerirFefoPorSku(sku);
  }

  // ============================================================
  // FEFO — CONFIRMAR PICKING
  // ============================================================
  @Post('picking')
  async confirmarPicking(@Body() dto: ConfirmarPickingDto) {
    return this.inventarioService.confirmarPickingFefo(dto);
  }

  @Patch(':id/ajustar')
async ajustarStock(
  @Param('id') id: string,
  @Body() dto: AjustarStockDto,
) {
  return this.inventarioService.ajustarStock(+id, dto);
}

}
