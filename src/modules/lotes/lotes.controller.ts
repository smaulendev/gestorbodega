import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LotesService } from './lotes.service';
import { CreateLoteDto } from './dto/create-lote.dto';
import { UpdateLoteDto } from './dto/update-lote.dto';

@Controller('lotes')
export class LotesController {
  constructor(private readonly lotesService: LotesService) {}

  @Get()
  findAll() {
    return this.lotesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lotesService.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateLoteDto) {
    return this.lotesService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateLoteDto) {
    return this.lotesService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lotesService.remove(+id);
  }

  // 🔍 Obtener el lote FEFO de un producto específico
  @Get('fefo/:productoId')
  obtenerLoteFEFO(@Param('productoId') productoId: string) {
    return this.lotesService.obtenerLoteFEFO(+productoId);
  }
}
