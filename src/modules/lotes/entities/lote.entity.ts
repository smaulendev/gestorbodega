import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Producto } from '../../productos/entities/producto.entity';
import { Inventario } from '../../inventario/entities/inventario.entity';

@Entity('lotes')
export class Lote {
  @PrimaryGeneratedColumn()
  id: number;

@Column({ unique: true })
codigoLote: string;


  @Column()
  fechaCaducidad: Date;

  @Column({ default: 'activo' })
  estado: string;

  // PRODUCTO
  @ManyToOne(() => Producto, (producto) => producto.lotes, {
    onDelete: 'CASCADE',
  })
  producto: Producto;

  @Column()
  productoId: number;

  // INVENTARIO (RELACIÓN INVERSA)
  @OneToMany(() => Inventario, (inv) => inv.lote)
  inventario: Inventario[];
}
