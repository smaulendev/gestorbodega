// import {
//   Controller,
//   Post,
//   Body,
//   Get,
//   Param,
//   Delete,
//   Query,
// } from '@nestjs/common';
// import { InventarioService } from './inventario.service';
// import { IngresarStockDto } from './dto/ingresar-stock.dto';
// import { TransferirStockDto } from './dto/transferir-stock.dto';

// @Controller('inventario')
// export class InventarioController {
//   constructor(private readonly inventarioService: InventarioService) {}

//   // A) Ingresar stock
//   @Post('ingresar')
//   ingresarStock(@Body() dto: IngresarStockDto) {
//     return this.inventarioService.ingresarStock(dto);
//   }

//   // B) Retirar stock
//   @Post('retirar')
//   retirarStock(@Body() dto: IngresarStockDto) {
//     return this.inventarioService.retirarStock(dto);
//   }

//   // C) Transferir stock entre ubicaciones
//   @Post('transferir')
//   transferirStock(@Body() dto: TransferirStockDto) {
//     return this.inventarioService.transferirStock(dto);
//   }

//   // D) Listar inventario completo
//   @Get()
//   listarInventario() {
//     return this.inventarioService.listarInventario();
//   }

//   // E) Listar resumen por lote/bodega
//   @Get('resumen')
//   listarResumen() {
//     return this.inventarioService.listarInventarioResumen();
//   }

//   // F) Ver inventario por ID
//   @Get(':id')
//   obtenerInventarioPorId(@Param('id') id: number) {
//     return this.inventarioService.obtenerInventarioPorId(id);
//   }

//   // G) Eliminar inventario
//   @Delete(':id')
//   eliminarInventario(@Param('id') id: number) {
//     return this.inventarioService.eliminarInventario(id);
//   }

//   // H) Inventario por bodega
//   @Get('bodega/:id')
//   inventarioPorBodega(@Param('id') id: number) {
//     return this.inventarioService.inventarioPorBodega(id);
//   }

//   // I) Inventario por ubicación
//   @Get('ubicacion/:id')
//   inventarioPorUbicacion(@Param('id') id: number) {
//     return this.inventarioService.inventarioPorUbicacion(id);
//   }

//   // J) Inventario por producto
//   @Get('producto/:id')
//   inventarioPorProducto(@Param('id') id: number) {
//     return this.inventarioService.inventarioPorProducto(id);
//   }

//   // K) Lotes por vencer
//   @Get('lotes/por-vencer')
//   lotesPorVencer(@Query('dias') dias?: number) {
//     return this.inventarioService.lotesPorVencer(dias);
//   }

//   // L) Lotes vencidos
//   @Get('lotes/vencidos')
//   lotesVencidos() {
//     return this.inventarioService.obtenerLotesVencidos();
//   }

//   // M) Resumen por producto
//   @Get('resumen/producto')
//   resumenPorProducto() {
//     return this.inventarioService.resumenPorProducto();
//   }

//   // N) Movimientos
//   @Get('movimientos')
//   listarMovimientos() {
//     return this.inventarioService.listarMovimientos();
//   }

//   @Post('ingresar')
// ingresarStock(@Body() dto: IngresarStockDto) {
//   return this.inventarioService.ingresarStock(dto);
// }

// }


import { Controller, Post, Body, HttpCode } from '@nestjs/common';
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
  
}
