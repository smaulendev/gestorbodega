import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { InventarioService } from './inventario.service';
import { IngresarStockDto } from './dto/ingresar-stock.dto';

@Controller('inventario')
export class InventarioController {
  constructor(private readonly inventarioService: InventarioService) {}

  /**
   * ======================================
   *     INGRESAR STOCK A INVENTARIO
   * ======================================
   */
  @Post('ingresar')
  ingresarStock(@Body() dto: IngresarStockDto) {
    return this.inventarioService.ingresarStock(dto);
  }

  /**
   * ======================================
   *          LISTAR INVENTARIO
   * ======================================
   */
  @Get()
  findAll() {
    return this.inventarioService.findAll();
  }

  /**
   * ======================================
   *         OBTENER INVENTARIO ID
   * ======================================
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.inventarioService.findOne(id);
  }

  /**
   * ======================================
   *          ELIMINAR REGISTRO
   * ======================================
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.inventarioService.remove(id);
  }
}
