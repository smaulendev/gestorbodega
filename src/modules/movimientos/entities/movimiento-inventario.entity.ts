import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Producto } from '../../productos/entities/producto.entity';
import { Lote } from '../../lotes/entities/lote.entity';
import { Bodega } from '../../bodegas/entities/bodega.entity';
import { Ubicacion } from '../../ubicaciones/entities/ubicacion.entity';

@Entity('movimientos_inventario') // 👈 nombre REAL de la tabla
export class MovimientoInventario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tipoMovimiento: string; // INGRESO, SALIDA, TRANSFERENCIA, etc.

  @Column()
  cantidad: number;

  @Column({ nullable: true })
  descripcion: string;

  @ManyToOne(() => Producto)
  producto: Producto;

  @ManyToOne(() => Lote)
  lote: Lote;

  @ManyToOne(() => Bodega)
  bodega: Bodega;

  @ManyToOne(() => Ubicacion)
  ubicacion: Ubicacion;

  @Column({ nullable: true })
  usuarioId: number; // conectar después con auth

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  fecha: Date;
}
