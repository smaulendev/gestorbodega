import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// ENTIDADES
import { Inventario } from './entities/inventario.entity';
import { MovimientoInventario } from './entities/movimiento-inventario.entity';
import { Producto } from '../productos/entities/producto.entity';
import { Lote } from '../lotes/entities/lote.entity';
import { Bodega } from '../bodegas/entities/bodega.entity';
import { Ubicacion } from '../ubicaciones/entities/ubicacion.entity';

// DTO
import { IngresarStockDto } from './dto/ingresar-stock.dto';
import { ConfirmarPickingDto } from './dto/confirmar-picking.dto';

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

    @InjectRepository(MovimientoInventario)
    private readonly movimientoRepo: Repository<MovimientoInventario>,
  ) {}

  // =====================================================================
  // 📌 1) INGRESAR STOCK (HU001 LISTA)
  // =====================================================================
  async ingresarStock(dto: IngresarStockDto) {
    const { cantidad, productoId, loteId, bodegaId, ubicacionId, descripcion } =
      dto;

    const producto = await this.productoRepo.findOne({ where: { id: productoId } });
    if (!producto) throw new NotFoundException('Producto no encontrado');

    const lote = await this.loteRepo.findOne({ where: { id: loteId } });
    if (!lote) throw new NotFoundException('Lote no encontrado');

    const bodega = await this.bodegaRepo.findOne({ where: { id: bodegaId } });
    if (!bodega) throw new NotFoundException('Bodega no encontrada');

    const ubicacion = await this.ubicacionRepo.findOne({
      where: { id: ubicacionId },
    });
    if (!ubicacion) throw new NotFoundException('Ubicación no encontrada');

    if (cantidad <= 0)
      throw new BadRequestException('La cantidad debe ser mayor a 0.');

    // Buscar inventario existente
    const inventario = await this.inventarioRepo.findOne({
      where: {
        producto: { id: producto.id },
        lote: { id: lote.id },
        bodega: { id: bodega.id },
        ubicacion: { id: ubicacion.id },
      },
      relations: ['producto', 'lote', 'bodega', 'ubicacion'],
    });

    if (inventario) {
      inventario.cantidad += cantidad;
      inventario.cantidadDisponible += cantidad;

      await this.inventarioRepo.save(inventario);
    } else {
      const nuevo = this.inventarioRepo.create({
        cantidad,
        cantidadDisponible: cantidad,
        cantidadReservada: 0,
        cantidadTransito: 0,
        estadoStock: 'Disponible',
        producto,
        lote,
        bodega,
        ubicacion,
      });

      await this.inventarioRepo.save(nuevo);
    }

    const movimiento = this.movimientoRepo.create({
      tipoMovimiento: 'INGRESO',
      cantidad,
      descripcion: descripcion ?? 'Ingreso de stock',
      productoId: producto.id,
      loteId: lote.id,
      bodegaId: bodega.id,
      ubicacionId: ubicacion.id,
      usuarioId: null,
    });

    await this.movimientoRepo.save(movimiento);

    return {
      statusCode: 201,
      message: 'Stock ingresado correctamente.',
    };
  }

  // =====================================================================
  // 📌 2) OBTENER INVENTARIO COMPLETO
  // =====================================================================
  async listarInventario() {
    return await this.inventarioRepo.find({
      relations: ['producto', 'lote', 'bodega', 'ubicacion'],
      order: {
        producto: { nombre: 'ASC' },
        lote: { fechaCaducidad: 'ASC' },
      },
    });
  }

  async obtenerInventarioGeneral() {
    return this.listarInventario();
  }

  // =====================================================================
  // 📌 3) FILTROS
  // =====================================================================
  async getInventario(filters: any) {
    const query = this.inventarioRepo
      .createQueryBuilder('inv')
      .leftJoinAndSelect('inv.producto', 'producto')
      .leftJoinAndSelect('inv.lote', 'lote')
      .leftJoinAndSelect('inv.bodega', 'bodega')
      .leftJoinAndSelect('inv.ubicacion', 'ubicacion');

    if (filters.productoId)
      query.andWhere('producto.id = :productoId', filters);

    if (filters.bodegaId)
      query.andWhere('bodega.id = :bodegaId', filters);

    if (filters.loteId)
      query.andWhere('lote.id = :loteId', filters);

    if (filters.estado)
      query.andWhere('inv.estadoStock = :estado', { estado: filters.estado });

    return await query.getMany();
  }

  // =====================================================================
  // 📌 4) HU002 — FEFO: SUGERIR LOTE QUE VENCE PRIMERO
  // =====================================================================
  async sugerirFefoPorSku(sku: string) {
    const producto = await this.productoRepo.findOne({
      where: { sku: sku },
    });

    if (!producto)
      throw new NotFoundException(`No existe producto con SKU ${sku}`);

    const inventarios = await this.inventarioRepo
      .createQueryBuilder('inv')
      .innerJoinAndSelect('inv.lote', 'lote')
      .innerJoinAndSelect('inv.bodega', 'bodega')
      .innerJoinAndSelect('inv.ubicacion', 'ubicacion')
      .where('inv.productoId = :id', { id: producto.id })
      .andWhere('inv.cantidadDisponible > 0')
      .andWhere("inv.estadoStock = 'Disponible'")
      .orderBy('lote.fechaCaducidad', 'ASC')
      .getMany();

    if (!inventarios.length)
      throw new NotFoundException('No hay stock disponible para FEFO');

    const sugerido = inventarios[0];

    return {
      sku,
      productoId: producto.id,
      sugerido: {
        inventarioId: sugerido.id,
        codigoLote: sugerido.lote.codigoLote,
        fechaCaducidad: sugerido.lote.fechaCaducidad,
        cantidadDisponible: sugerido.cantidadDisponible,
        bodega: sugerido.bodega.nombre,
        bodegaId: sugerido.bodegaId,
        ubicacion: sugerido.ubicacion.nombre,
        ubicacionId: sugerido.ubicacionId,
      },
      alternativas: inventarios.map((inv) => ({
        inventarioId: inv.id,
        codigoLote: inv.lote.codigoLote,
        fechaCaducidad: inv.lote.fechaCaducidad,
        cantidadDisponible: inv.cantidadDisponible,
        bodega: inv.bodega.nombre,
        bodegaId: inv.bodegaId,
        ubicacion: inv.ubicacion.nombre,
        ubicacionId: inv.ubicacionId,
      })),
    };
  }

  // =====================================================================
  // 📌 5) HU002 — CONFIRMAR PICKING FEFO FORZADO
  // =====================================================================
  async confirmarPickingFefo(dto: ConfirmarPickingDto) {
    const { sku, codigoLote, cantidad } = dto;

    const fefo = await this.sugerirFefoPorSku(sku);
    const sugerido = fefo.sugerido;

    if (codigoLote !== sugerido.codigoLote) {
      throw new BadRequestException({
        status: 'error',
        reason: 'FEFO_BLOCKED',
        message: `Debes recoger el lote ${sugerido.codigoLote} que vence primero.`,
      });
    }

    const inventario = await this.inventarioRepo.findOne({
      where: { id: sugerido.inventarioId },
    });

    if (!inventario)
      throw new NotFoundException('Inventario no encontrado para el lote sugerido.');

    if (inventario.cantidadDisponible < cantidad) {
      throw new BadRequestException(
        `Stock insuficiente. Disponible: ${inventario.cantidadDisponible}`,
      );
    }

    inventario.cantidadDisponible -= cantidad;
    inventario.cantidad -= cantidad;

    if (inventario.cantidadDisponible === 0)
      inventario.estadoStock = 'Agotado';

    await this.inventarioRepo.save(inventario);

    const movimiento = this.movimientoRepo.create({
      tipoMovimiento: 'PICKING',
      cantidad,
      descripcion: `Picking FEFO del lote ${codigoLote}`,
      productoId: inventario.productoId,
      loteId: inventario.loteId,
      bodegaId: inventario.bodegaId,
      ubicacionId: inventario.ubicacionId,
      usuarioId: null,
    });

    await this.movimientoRepo.save(movimiento);

    return {
      status: 'ok',
      message: 'Picking FEFO confirmado.',
      inventarioActualizado: inventario,
    };
  }
}
