import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('movimientos_inventario')
export class MovimientoInventario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tipoMovimiento: string;

  @Column()
  cantidad: number;

  @Column('text', { nullable: true })
  descripcion: string | null;

  @CreateDateColumn()
  fecha: Date;

  @Column()
  productoId: number;

  @Column()
  loteId: number;

  @Column()
  bodegaId: number;

  @Column()
  ubicacionId: number;

  @Column('int', { nullable: true })
  usuarioId: number | null;
}
