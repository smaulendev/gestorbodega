import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Inventario } from '../../inventario/entities/inventario.entity';
import { Ubicacion } from '../../ubicaciones/entities/ubicacion.entity';

@Entity('bodegas')
export class Bodega {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  descripcion: string;

  // 🔥 UNA BODEGA TIENE MUCHAS UBICACIONES
  @OneToMany(() => Ubicacion, (ubicacion) => ubicacion.bodega)
  ubicaciones: Ubicacion[];

  // Relación con inventario
  @OneToMany(() => Inventario, (inv) => inv.bodega)
  inventario: Inventario[];
}
