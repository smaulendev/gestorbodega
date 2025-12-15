// reportes.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventario } from '../inventario/entities/inventario.entity';
import { MovimientoInventario } from '../inventario/entities/movimiento-inventario.entity';

@Injectable()
export class ReportesService {
  constructor(
    @InjectRepository(Inventario)
    private readonly inventarioRepo: Repository<Inventario>,

    @InjectRepository(MovimientoInventario)
    private readonly movimientoRepo: Repository<MovimientoInventario>,
  ) {}

  async getDashboardResumen() {
    const { totalProductos } = await this.inventarioRepo
      .createQueryBuilder('inv')
      .select('COUNT(DISTINCT inv.productoId)', 'totalProductos')
      .getRawOne();

    const { stockTotal } = await this.inventarioRepo
      .createQueryBuilder('inv')
      .select('COALESCE(SUM(inv.cantidadDisponible), 0)', 'stockTotal')
      .getRawOne();

    const { lotesPorVencer } = await this.inventarioRepo
      .createQueryBuilder('inv')
      .leftJoin('inv.lote', 'lote')
      .select('COUNT(DISTINCT lote.id)', 'lotesPorVencer')
      .where('lote."fechaCaducidad" BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL \'30 days\'')
      .getRawOne();

    const { movimientosHoy } = await this.movimientoRepo
      .createQueryBuilder('mov')
      .select('COUNT(*)', 'movimientosHoy')
      .where('mov."fecha"::date = CURRENT_DATE')
      .getRawOne();

    return {
      totalProductos: Number(totalProductos || 0),
      stockTotal: Number(stockTotal || 0),
      lotesPorVencer: Number(lotesPorVencer || 0),
      movimientosHoy: Number(movimientosHoy || 0),
    };
  }

async getMovimientosDiarios() {
  const rows = await this.movimientoRepo
    .createQueryBuilder('mov')
    .select('mov."fecha"::date', 'fecha')
    .addSelect('COUNT(*)', 'total')
    .where('mov."fecha" >= CURRENT_DATE - INTERVAL \'6 days\'')
    .groupBy('mov."fecha"::date')
    .orderBy('fecha', 'ASC')
    .getRawMany();

  const hoy = new Date();
  const mapa: Record<string, number> = {};

  rows.forEach((r) => {
    mapa[r.fecha] = Number(r.total);
  });

  // 👇 AQUÍ ESTABA EL PROBLEMA
  const resultado: { fecha: string; total: number }[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(hoy);
    d.setDate(hoy.getDate() - i);
    const iso = d.toISOString().slice(0, 10);

    resultado.push({
      fecha: iso,
      total: mapa[iso] ?? 0,
    });
  }

  return resultado;
}
}