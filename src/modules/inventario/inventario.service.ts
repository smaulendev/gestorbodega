import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
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

  // ============================================================
  // 📌 INGRESAR STOCK
  // ============================================================
  async ingresarStock(dto: IngresarStockDto) {
    const { cantidad, productoId, loteId, bodegaId, ubicacionId, descripcion } =
      dto;

    // -------------------------------------------------------------------
    // 1️⃣ VALIDACIONES
    // -------------------------------------------------------------------

    const producto = await this.productoRepo.findOne({
      where: { id: productoId },
    });
    if (!producto)
      throw new NotFoundException({
        statusCode: 404,
        errorCode: 'PRODUCT_NOT_FOUND',
        message: `El producto con ID ${productoId} no existe.`,
      });

    const lote = await this.loteRepo.findOne({
      where: { id: loteId },
    });
    if (!lote)
      throw new NotFoundException({
        statusCode: 404,
        errorCode: 'LOT_NOT_FOUND',
        message: `El lote con ID ${loteId} no existe.`,
      });

    const bodega = await this.bodegaRepo.findOne({
      where: { id: bodegaId },
    });
    if (!bodega)
      throw new NotFoundException({
        statusCode: 404,
        errorCode: 'WAREHOUSE_NOT_FOUND',
        message: `La bodega con ID ${bodegaId} no existe.`,
      });

    const ubicacion = await this.ubicacionRepo.findOne({
      where: { id: ubicacionId },
    });
    if (!ubicacion)
      throw new NotFoundException({
        statusCode: 404,
        errorCode: 'LOCATION_NOT_FOUND',
        message: `La ubicación con ID ${ubicacionId} no existe.`,
      });

    if (cantidad <= 0)
      throw new BadRequestException({
        statusCode: 400,
        errorCode: 'INVALID_QTY',
        message: 'La cantidad debe ser mayor a 0.',
      });

    // -------------------------------------------------------------------
    // 2️⃣ BUSCAR INVENTARIO EXISTENTE
    // -------------------------------------------------------------------

    const inv = await this.inventarioRepo.findOne({
      where: {
        producto: { id: producto.id },
        lote: { id: lote.id },
        bodega: { id: bodega.id },
        ubicacion: { id: ubicacion.id },
      },
      relations: ['producto', 'lote', 'bodega', 'ubicacion'],
    });

    // -------------------------------------------------------------------
    // 3️⃣ SI EXISTE ➜ SUMA / SI NO ➜ CREA
    // -------------------------------------------------------------------

    if (inv) {
      inv.cantidad += cantidad;
      inv.cantidadDisponible += cantidad;

      await this.inventarioRepo.save(inv);
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

    // -------------------------------------------------------------------
    // 4️⃣ REGISTRAR MOVIMIENTO
    // -------------------------------------------------------------------

    const movimiento = this.movimientoRepo.create({
      tipoMovimiento: 'INGRESO',
      cantidad,
      descripcion: descripcion ?? 'Ingreso de stock',
      productoId: producto.id,
      loteId: lote.id,
      bodegaId: bodega.id,
      ubicacionId: ubicacion.id,
      usuarioId: null, // luego conectamos con auth
    });

    await this.movimientoRepo.save(movimiento);

    // -------------------------------------------------------------------
    // 5️⃣ RESPUESTA PROFESIONAL
    // -------------------------------------------------------------------

    return {
      statusCode: 201,
      message: 'Stock ingresado correctamente.',
      detalle: {
        producto: producto.nombre,
        lote: lote.codigoLote ?? lote.id,
        bodega: bodega.nombre,
        ubicacion: ubicacion.nombre,
        cantidadIngresada: cantidad,
      },
    };
  }
}
