import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Lote } from '../../lotes/entities/lote.entity';
import { Inventario } from '../../inventario/entities/inventario.entity';

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sku: string;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  categoria: string;

  @Column({ default: false })
  esConsumible: boolean;

  @Column('decimal', { precision: 10, scale: 2 })
  costoUnitario: number;

  @Column('decimal', { precision: 10, scale: 2 })
  precioSugerido: number;

  @OneToMany(() => Lote, (lote) => lote.producto)
  lotes: Lote[];

  @OneToMany(() => Inventario, (inv) => inv.producto)
  inventario: Inventario[];
}
