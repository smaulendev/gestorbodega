import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Inventario } from '../../inventario/entities/inventario.entity';

@Entity('bodegas')
export class Bodega {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  descripcion: string;

  @OneToMany(() => Inventario, (inv) => inv.bodega)
  inventario: Inventario[];
}
