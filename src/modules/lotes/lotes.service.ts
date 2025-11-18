import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lote } from './entities/lote.entity';
import { CreateLoteDto } from './dto/create-lote.dto';
import { UpdateLoteDto } from './dto/update-lote.dto';
import { Producto } from '../productos/entities/producto.entity';

@Injectable()
export class LotesService {
  constructor(
    @InjectRepository(Lote)
    private readonly loteRepo: Repository<Lote>,
    @InjectRepository(Producto)
    private readonly productoRepo: Repository<Producto>,
  ) {}

  async findAll(): Promise<Lote[]> {
    return await this.loteRepo.find({ relations: ['producto'] });
  }

  async findOne(id: number): Promise<Lote> {
    const lote = await this.loteRepo.findOne({ where: { id }, relations: ['producto'] });
    if (!lote) throw new NotFoundException(`Lote ${id} no encontrado`);
    return lote;
  }

  async create(dto: CreateLoteDto): Promise<Lote> {
    const producto = await this.productoRepo.findOne({ where: { id: dto.productoId } });
    if (!producto) throw new NotFoundException(`Producto ${dto.productoId} no existe`);

    const nuevoLote = this.loteRepo.create({
      codigoLote: dto.codigoLote,
      fechaCaducidad: new Date(dto.fechaCaducidad),
      producto,
    });
    return await this.loteRepo.save(nuevoLote);
  }

  async update(id: number, dto: UpdateLoteDto): Promise<Lote> {
    const lote = await this.findOne(id);
    Object.assign(lote, dto);
    return await this.loteRepo.save(lote);
  }

  async remove(id: number): Promise<{ message: string }> {
    const lote = await this.findOne(id);
    await this.loteRepo.remove(lote);
    return { message: `Lote ${id} eliminado correctamente` };
  }

  // 🔍 FEFO: obtener el lote más próximo a caducar para un producto
  async obtenerLoteFEFO(productoId: number): Promise<Lote | null> {
    return await this.loteRepo.findOne({
      where: { producto: { id: productoId } },
      order: { fechaCaducidad: 'ASC' },
      relations: ['producto'],
    });
  }
}
