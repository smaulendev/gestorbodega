import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RolUsuario } from './rol.enum';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Controller('usuarios')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RolUsuario.ADMIN) // 🔐 TODO este controller es solo ADMIN
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  // =====================================================
  // GET /usuarios -> listar todos
  // =====================================================
  @Get()
  async findAll() {
    return this.usuariosService.findAll();
  }

  // =====================================================
  // GET /usuarios/:id -> obtener uno
  // =====================================================
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.findById(id);
  }

  // =====================================================
  // PATCH /usuarios/:id -> actualizar (rol, nombre, activo)
  // =====================================================
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUsuarioDto,
  ) {
    return this.usuariosService.update(id, dto);
  }

  // =====================================================
  // DELETE /usuarios/:id -> desactivar (soft delete)
  // =====================================================
  @Delete(':id')
  async desactivar(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.desactivar(id);
  }
}
