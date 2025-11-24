import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RolUsuario } from './rol.enum';

@Controller('usuarios')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  @Roles(RolUsuario.ADMIN) // 👈 CORREGIDO
  async findAll() {
    return this.usuariosService.findAll();
  }

  @Get(':id')
  @Roles(RolUsuario.ADMIN) // 👈 CORREGIDO
  async findOne(@Param('id') id: string) {
    return this.usuariosService.findById(+id); // 👈 CORREGIDO
  }
}
