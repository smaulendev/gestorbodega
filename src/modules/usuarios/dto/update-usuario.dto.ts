// src/modules/usuarios/dto/update-usuario.dto.ts
import { IsOptional, IsEnum, IsBoolean, IsString } from 'class-validator';
import { RolUsuario } from '../rol.enum'; // 👈 ajusta esto si tu enum está en otro archivo

export class UpdateUsuarioDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsEnum(RolUsuario)
  rol?: RolUsuario;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
