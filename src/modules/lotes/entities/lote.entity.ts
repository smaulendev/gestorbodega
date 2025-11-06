import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Producto } from '../../productos/entities/producto.entity';

@Entity('lotes')
export class Lote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  codigoLote: string;

  @Column({ type: 'date' })
  fechaCaducidad: Date;

  @Column({ default: 'activo' })
  estado: string;

  @ManyToOne(() => Producto, (producto) => producto.lotes, { onDelete: 'CASCADE' })
  producto: Producto;
}
