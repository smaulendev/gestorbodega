// import { Controller, Get, Post, Body, Param, NotFoundException } from '@nestjs/common';
// import { BodegasService } from './bodegas.service';

// @Controller('bodegas')
// export class BodegasController {
//   constructor(private readonly bodegasService: BodegasService) {}

//   // GET /bodegas
//   @Get()
//   findAll() {
//     return this.bodegasService.findAll();
//   }

//   // GET /bodegas/:id
//   @Get(':id')
//   async findOne(@Param('id') id: string) {
//     const bodega = await this.bodegasService.findOne(+id);
//     if (!bodega) throw new NotFoundException('Bodega no encontrada');
//     return bodega;
//   }

//   // POST /bodegas
//   @Post()
//   create(@Body() body: any) {
//     return this.bodegasService.create(body);
//   }
// }


import { Controller, Get, Post, Body, Delete, Param, Patch } from '@nestjs/common';
import { BodegasService } from './bodegas.service';

@Controller('bodegas')
export class BodegasController {
  constructor(private readonly bodegasService: BodegasService) {}

  @Get()
  findAll() {
    return this.bodegasService.findAll();
  }

  @Post()
  create(@Body() dto: { nombre: string }) {
    return this.bodegasService.create(dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.bodegasService.delete(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: { nombre?: string; descripcion?: string }) {
    return this.bodegasService.update(+id, dto);
  }
}
