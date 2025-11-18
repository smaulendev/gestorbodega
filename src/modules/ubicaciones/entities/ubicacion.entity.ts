import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Inventario } from '../../inventario/entities/inventario.entity';

@Entity('ubicaciones')
export class Ubicacion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  descripcion: string;

  @OneToMany(() => Inventario, (inv) => inv.ubicacion)
  inventario: Inventario[];
}
