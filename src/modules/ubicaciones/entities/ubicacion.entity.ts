import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Inventario } from '../../inventario/entities/inventario.entity';
import { Bodega } from '../../bodegas/entities/bodega.entity';

@Entity('ubicaciones')
export class Ubicacion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  descripcion: string;

  // 🔥 MUY IMPORTANTE: una ubicación pertenece a una bodega
  @ManyToOne(() => Bodega, (bodega) => bodega.ubicaciones, { onDelete: 'CASCADE' })
  bodega: Bodega;

  @Column()
  bodegaId: number;

  // Relación inversa para inventario
  @OneToMany(() => Inventario, (inv) => inv.ubicacion)
  inventario: Inventario[];
}
