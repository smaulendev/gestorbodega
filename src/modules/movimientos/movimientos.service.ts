import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MovimientoInventario } from '../inventario/entities/movimiento-inventario.entity';

@Injectable()
export class MovimientosService {
  constructor(
    @InjectRepository(MovimientoInventario)
    private readonly movimientoRepo: Repository<MovimientoInventario>,
  ) {}

  async getMovimientos(filters: any) {
    const query = this.movimientoRepo
      .createQueryBuilder('mov')
      .leftJoinAndSelect('mov.producto', 'producto')
      .leftJoinAndSelect('mov.lote', 'lote')
      .leftJoinAndSelect('mov.bodega', 'bodega')
      .leftJoinAndSelect('mov.ubicacion', 'ubicacion');

    if (filters.productoId) {
      query.andWhere('producto.id = :productoId', {
        productoId: filters.productoId,
      });
    }

    if (filters.tipo) {
      query.andWhere('mov.tipoMovimiento = :tipo', {
        tipo: filters.tipo,
      });
    }

    if (filters.fechaDesde) {
      query.andWhere('mov.fecha >= :desde', { desde: filters.fechaDesde });
    }

    if (filters.fechaHasta) {
      query.andWhere('mov.fecha <= :hasta', { hasta: filters.fechaHasta });
    }

    return query.orderBy('mov.fecha', 'DESC').getMany();
  }
}
