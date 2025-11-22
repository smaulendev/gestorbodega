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

  async create(dto: CreateProductoDto): Promise<Producto> {
    const nuevo = this.productoRepo.create(dto);
    return await this.productoRepo.save(nuevo);
  }

  // async update(id: number, dto: UpdateProductoDto): Promise<Producto> {
  //   const producto = await this.findOne(id);
  //   Object.assign(producto, dto);
  //   return await this.productoRepo.save(producto);
  // }

  async remove(id: number): Promise<{ message: string }> {
    const producto = await this.findOne(id);
    await this.productoRepo.remove(producto);
    return { message: `Producto ${id} eliminado correctamente` };
  }

  async update(id: number, dto: CreateProductoDto) {
  const producto = await this.productoRepo.findOneBy({ id });
  if (!producto) throw new NotFoundException('Producto no encontrado');

  Object.assign(producto, dto);
  return this.productoRepo.save(producto);
}

}
