import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

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

  // Hash de la contraseña
  @Column()
  passwordHash: string;

  @Column({
    type: 'enum',
    enum: RolUsuario,
    default: RolUsuario.OPERARIO,
  })
  rol: RolUsuario;

  @CreateDateColumn()
  creadoEn: Date;
}
