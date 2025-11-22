// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Bodega } from './entities/bodega.entity';

// @Injectable()
// export class BodegasService {
//   constructor(
//     @InjectRepository(Bodega)
//     private readonly bodegasRepository: Repository<Bodega>,
//   ) {}

//   findAll() {
//     return this.bodegasRepository.find();
//   }

//   findOne(id: number) {
//     return this.bodegasRepository.findOne({ where: { id } });
//   }

//   create(data: Partial<Bodega>) {
//     const nueva = this.bodegasRepository.create(data);
//     return this.bodegasRepository.save(nueva);
//   }
// }

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bodega } from './entities/bodega.entity';


@Injectable()
export class BodegasService {
  constructor(
    @InjectRepository(Bodega)
    private readonly bodegaRepo: Repository<Bodega>,
  ) {}

  findAll() {
    return this.bodegaRepo.find({ order: { id: 'ASC' } });
  }

  async create(dto: { nombre: string }) {
    const nueva = this.bodegaRepo.create(dto);
    return this.bodegaRepo.save(nueva);
  }

  async delete(id: number) {
    const bodega = await this.bodegaRepo.findOne({ where: { id } });
    if (!bodega) throw new NotFoundException(`La bodega ${id} no existe`);

    await this.bodegaRepo.remove(bodega);
    return { message: `Bodega ${id} eliminada correctamente` };
  }

  async update(id: number, dto: { nombre?: string; descripcion?: string }) {
    const bodega = await this.bodegaRepo.findOne({ where: { id } });
    if (!bodega) throw new NotFoundException(`La bodega ${id} no existe`);

    Object.assign(bodega, dto);
    return this.bodegaRepo.save(bodega);
  }
}
