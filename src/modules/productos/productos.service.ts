import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepo: Repository<Producto>,
  ) {}

  async findAll(): Promise<Producto[]> {
    return await this.productoRepo.find();
  }

  async findOne(id: number): Promise<Producto> {
    const producto = await this.productoRepo.findOne({ where: { id } });
    if (!producto) throw new NotFoundException(`Producto ${id} no encontrado`);
    return producto;
  }

  // ==============================
  //     CREAR PRODUCTO <----
  // ==============================
  async create(dto: CreateProductoDto): Promise<Producto> {
    // 1. Buscar el último producto creado (por ID)
    const ultimo = await this.productoRepo
      .createQueryBuilder('producto')
      .orderBy('producto.id', 'DESC')
      .getOne();

    // 2. Calcular el siguiente número correlativo
    let siguienteNumero = 1;

    if (ultimo && ultimo.sku) {
      const partes = ultimo.sku.split('-'); // SKU-0003 → ["SKU", "0003"]
      const numeroActual = parseInt(partes[1], 10);

      if (!isNaN(numeroActual)) {
        siguienteNumero = numeroActual + 1;
      }
    }

    // 3. Construir el nuevo SKU
    const nuevoSku = `SKU-${String(siguienteNumero).padStart(4, '0')}`;

    // 4. Crear el producto y asignar el SKU generado
    const nuevoProducto = this.productoRepo.create({
      ...dto,
      sku: nuevoSku,
    });

    return await this.productoRepo.save(nuevoProducto);
  }

  // ==============================
  //     ACTUALIZAR PRODUCTO
  // ==============================
  async update(id: number, dto: UpdateProductoDto) {
    const producto = await this.productoRepo.findOneBy({ id });
    if (!producto) throw new NotFoundException('Producto no encontrado');

    Object.assign(producto, dto);
    return this.productoRepo.save(producto);
  }

  // ==============================
  //     ELIMINAR PRODUCTO
  // ==============================
  async remove(id: number): Promise<{ message: string }> {
    const producto = await this.findOne(id);
    await this.productoRepo.remove(producto);
    return { message: `Producto ${id} eliminado correctamente` };
  }
}
