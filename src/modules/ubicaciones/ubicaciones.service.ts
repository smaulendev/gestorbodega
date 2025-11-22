import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ubicacion } from './entities/ubicacion.entity';
import { Bodega } from '../bodegas/entities/bodega.entity';

@Injectable()
export class UbicacionesService {
  constructor(
    @InjectRepository(Ubicacion)
    private readonly ubicacionesRepo: Repository<Ubicacion>,

    @InjectRepository(Bodega)
    private readonly bodegasRepo: Repository<Bodega>,
  ) {}

  async findAll(): Promise<Ubicacion[]> {
    return this.ubicacionesRepo.find({
      relations: ['bodega'],
      order: { id: 'ASC' },
    });
  }

  async findByBodega(bodegaId: number): Promise<Ubicacion[]> {
    return this.ubicacionesRepo.find({
      where: { bodega: { id: bodegaId } },
      relations: ['bodega'],
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Ubicacion> {
    const ubicacion = await this.ubicacionesRepo.findOne({
      where: { id },
      relations: ['bodega'],
    });

    if (!ubicacion) {
      throw new NotFoundException(`Ubicación ${id} no encontrada`);
    }

    return ubicacion;
  }

  async create(nombre: string, bodegaId: number): Promise<Ubicacion> {
    const bodega = await this.bodegasRepo.findOne({
      where: { id: bodegaId },
    });

    if (!bodega) {
      throw new NotFoundException(`Bodega ${bodegaId} no existe`);
    }

    const ubicacion = this.ubicacionesRepo.create({
      nombre,
      bodega,
    });

    return this.ubicacionesRepo.save(ubicacion);
  }

  async update(id: number, nombre: string): Promise<Ubicacion> {
    const ubicacion = await this.findOne(id);
    ubicacion.nombre = nombre;
    return this.ubicacionesRepo.save(ubicacion);
  }

  async remove(id: number): Promise<void> {
    const ubicacion = await this.findOne(id);
    await this.ubicacionesRepo.remove(ubicacion);
  }
}
