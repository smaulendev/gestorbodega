import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { UbicacionesService } from './ubicaciones.service';

@Controller('ubicaciones')
export class UbicacionesController {
  constructor(private readonly ubicacionesService: UbicacionesService) {}

  // GET /ubicaciones
  @Get()
  findAll() {
    return this.ubicacionesService.findAll();
  }

  // GET /ubicaciones/bodega/:bodegaId
  @Get('bodega/:bodegaId')
  findByBodega(@Param('bodegaId') bodegaId: string) {
    return this.ubicacionesService.findByBodega(Number(bodegaId));
  }

  // POST /ubicaciones
  // body: { "nombre": "Estantería 1", "bodegaId": 1 }
  @Post()
  create(
    @Body('nombre') nombre: string,
    @Body('bodegaId') bodegaId: number,
  ) {
    return this.ubicacionesService.create(nombre, Number(bodegaId));
  }

  // PATCH /ubicaciones/:id
  // body: { "nombre": "Nuevo nombre" }
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body('nombre') nombre: string,
  ) {
    return this.ubicacionesService.update(Number(id), nombre);
  }

  // DELETE /ubicaciones/:id
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ubicacionesService.remove(Number(id));
  }
}
