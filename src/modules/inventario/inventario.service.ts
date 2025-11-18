import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Inventario } from './entities/inventario.entity';
import { Producto } from '../productos/entities/producto.entity';
import { Lote } from '../lotes/entities/lote.entity';
import { Bodega } from '../bodegas/entities/bodega.entity';
import { Ubicacion } from '../ubicaciones/entities/ubicacion.entity';

import { IngresarStockDto } from './dto/ingresar-stock.dto';

@Injectable()
export class InventarioService {
  constructor(
    @InjectRepository(Inventario)
    private readonly inventarioRepo: Repository<Inventario>,

    @InjectRepository(Producto)
    private readonly productoRepo: Repository<Producto>,

    @InjectRepository(Lote)
    private readonly loteRepo: Repository<Lote>,

    @InjectRepository(Bodega)
    private readonly bodegaRepo: Repository<Bodega>,

    @InjectRepository(Ubicacion)
    private readonly ubicacionRepo: Repository<Ubicacion>,
  ) {}

  /**
   * =============================
   *   INGRESO DE STOCK A BODEGA
   * =============================
   */
  async ingresarStock(dto: IngresarStockDto) {
    const { cantidad, productoId, loteId, bodegaId, ubicacionId } = dto;

    // 1) Validar PRODUCTO
    const producto = await this.productoRepo.findOne({ where: { id: productoId } });
    if (!producto) throw new NotFoundException(`El producto ${productoId} no existe`);

    // 2) Validar LOTE
    const lote = await this.loteRepo.findOne({ where: { id: loteId } });
    if (!lote) throw new NotFoundException(`El lote ${loteId} no existe`);

    if (lote.productoId !== productoId) {
      throw new BadRequestException(`El lote pertenece a otro producto`);
    }

    // 3) Validar BODEGA
    const bodega = await this.bodegaRepo.findOne({ where: { id: bodegaId } });
    if (!bodega) throw new NotFoundException(`La bodega ${bodegaId} no existe`);

    // 4) Validar UBICACIÓN
    const ubicacion = await this.ubicacionRepo.findOne({ where: { id: ubicacionId } });
    if (!ubicacion) throw new NotFoundException(`La ubicación ${ubicacionId} no existe`);

    // 5) Buscar inventario ya existente (producto + lote + bodega + ubicación)
    let inventario = await this.inventarioRepo.findOne({
      where: { productoId, loteId, bodegaId, ubicacionId },
    });

    // 6) Crear o sumar cantidad
    if (!inventario) {
      inventario = this.inventarioRepo.create({
        productoId,
        loteId,
        bodegaId,
        ubicacionId,
        cantidadDisponible: cantidad,
        cantidadReservada: 0,
        cantidadTransito: 0,
      });
    } else {
      inventario.cantidadDisponible += cantidad;
    }

    // 7) Calcular estado del stock
    inventario.estadoStock =
      inventario.cantidadDisponible <= 0
        ? 'Agotado'
        : inventario.cantidadDisponible <= 5
        ? 'Crítico'
        : 'Disponible';

    // 8) Guardar registro final
    return await this.inventarioRepo.save(inventario);
  }

  /**
   * =============================
   *      LISTAR INVENTARIO
   * =============================
   */
  async findAll() {
    return this.inventarioRepo.find({
      relations: ['producto', 'lote', 'bodega', 'ubicacion'],
    });
  }

  /**
   * =============================
   *     OBTENER INVENTARIO ID
   * =============================
   */
  async findOne(id: number) {
    const inv = await this.inventarioRepo.findOne({
      where: { id },
      relations: ['producto', 'lote', 'bodega', 'ubicacion'],
    });

    if (!inv) throw new NotFoundException(`Inventario ${id} no existe`);
    return inv;
  }

  /**
   * =============================
   *     ELIMINAR INVENTARIO
   * =============================
   */
  async remove(id: number) {
    const existe = await this.inventarioRepo.findOne({ where: { id } });
    if (!existe) throw new NotFoundException(`Inventario ${id} no existe`);

    await this.inventarioRepo.delete(id);
    return { message: 'Eliminado correctamente' };
  }
}
