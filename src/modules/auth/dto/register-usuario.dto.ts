import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { RolUsuario } from '../../usuarios/entities/usuario.entity';

export class RegisterUsuarioDto {
  @IsString()
  nombre: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(4)
  password: string;

  @IsEnum(RolUsuario)
  rol: RolUsuario;
}
