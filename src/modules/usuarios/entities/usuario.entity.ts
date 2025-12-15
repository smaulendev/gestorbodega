import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

export enum RolUsuario {
  ADMIN = 'ADMIN',
  OPERARIO = 'OPERARIO',
  VENDEDOR = 'VENDEDOR',
}

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  passwordHash: string;

  @Column({
    type: 'enum',
    enum: RolUsuario,
    default: RolUsuario.OPERARIO,
  })
  rol: RolUsuario;

  @Column({ default: true })  // 👈 NUEVO
  activo: boolean;

  @CreateDateColumn()
  creadoEn: Date;
}
