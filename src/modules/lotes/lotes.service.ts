import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lote } from './entities/lote.entity';
import { CreateLoteDto } from './dto/create-lote.dto';
import { UpdateLoteDto } from './dto/update-lote.dto';
import { Producto } from '../productos/entities/producto.entity';
import { Like } from 'typeorm';


@Injectable()
export class LotesService {
  constructor(
    @InjectRepository(Lote)
    private readonly loteRepo: Repository<Lote>,

    @InjectRepository(Producto)
    private readonly productoRepo: Repository<Producto>,
  ) {}

  async findAll(): Promise<Lote[]> {
    return await this.loteRepo.find({
      relations: ['producto'],
      order: { fechaCaducidad: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Lote> {
    const lote = await this.loteRepo.findOne({
      where: { id },
      relations: ['producto'],
    });

    if (!lote) {
      throw new NotFoundException(`Lote ${id} no encontrado`);
    }

    return lote;
  }

  // ----------------------------------------------------
  // 🔥 GENERADOR AUTOMÁTICO DEL NÚMERO DE LOTE
  // ----------------------------------------------------
  private async generarCodigoLote(): Promise<string> {
    const hoy = new Date();
    const y = hoy.getFullYear();
    const m = String(hoy.getMonth() + 1).padStart(2, '0');
    const d = String(hoy.getDate()).padStart(2, '0');

    const fechaCodigo = `${y}${m}${d}`;

    // Busca cuántos lotes se crearon hoy
const lotesHoy = await this.loteRepo.count({
  where: {
    codigoLote: Like(`LOT-${fechaCodigo}-%`),
  },
});


    const secuencia = String(lotesHoy + 1).padStart(4, '0');

    return `LOT-${fechaCodigo}-${secuencia}`;
  }

  // ----------------------------------------------------
  // 🔥 CREAR LOTE
  // ----------------------------------------------------
  async create(dto: CreateLoteDto): Promise<Lote> {
    const producto = await this.productoRepo.findOne({
      where: { id: dto.productoId },
    });

    if (!producto) {
      throw new NotFoundException(`Producto ${dto.productoId} no existe`);
    }

    const fecha = new Date(dto.fechaCaducidad);
    if (isNaN(fecha.getTime())) {
      throw new NotFoundException(
        `Fecha inválida: ${dto.fechaCaducidad}. Formato requerido: YYYY-MM-DD`
      );
    }

    const codigoLote = await this.generarCodigoLote();

    const lote = this.loteRepo.create({
      codigoLote,
      fechaCaducidad: fecha,
      producto,
    });

    return await this.loteRepo.save(lote);
  }

  // ----------------------------------------------------
  // 🔧 ACTUALIZAR
  // ----------------------------------------------------
  async update(id: number, dto: UpdateLoteDto): Promise<Lote> {
    const lote = await this.findOne(id);

    if (dto.fechaCaducidad) {
      const fecha = new Date(dto.fechaCaducidad);
      if (isNaN(fecha.getTime())) {
        throw new NotFoundException(`Fecha inválida: ${dto.fechaCaducidad}`);
      }
      lote.fechaCaducidad = fecha;
    }

    if (dto.productoId) {
      const producto = await this.productoRepo.findOne({
        where: { id: dto.productoId },
      });

      if (!producto) {
        throw new NotFoundException(`Producto ${dto.productoId} no existe`);
      }

      lote.producto = producto;
    }

    return await this.loteRepo.save(lote);
  }

  async remove(id: number): Promise<{ message: string }> {
    const lote = await this.findOne(id);
    await this.loteRepo.remove(lote);
    return { message: `Lote ${id} eliminado correctamente` };
  }

  async obtenerLoteFEFO(productoId: number): Promise<Lote | null> {
    return await this.loteRepo.findOne({
      where: { producto: { id: productoId } },
      order: { fechaCaducidad: 'ASC' },
      relations: ['producto'],
    });
  }

  async findByProducto(productoId: number) {
  return await this.loteRepo.find({
    where: { producto: { id: productoId } },
    order: { fechaCaducidad: "ASC" },
    relations: ["producto"],
  });
}

}
