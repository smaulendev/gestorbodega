import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Producto } from '../../productos/entities/producto.entity';

@Entity('inventario')
export class Inventario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  cantidadDisponible: number;

  @Column('int', { default: 0 })
  cantidadReservada: number;

  @Column({ default: 'Disponible' })
  estadoStock: string;

  @ManyToOne(() => Producto, (producto) => producto.inventario, { onDelete: 'CASCADE' })
  producto: Producto;
}
