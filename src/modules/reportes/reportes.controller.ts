import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RolUsuario } from '../usuarios/rol.enum';
import { ReportesService } from './reportes.service';

@Controller('reportes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

  // 👇 Dashboard visible para TODOS los roles autenticados
  @Roles(RolUsuario.ADMIN, RolUsuario.OPERARIO, RolUsuario.VENDEDOR)
  @Get('dashboard')
  getDashboardResumen() {
    return this.reportesService.getDashboardResumen();
  }

  // 👇 Gráfico de movimientos diarios SOLO para ADMIN
  @Roles(RolUsuario.ADMIN)
  @Get('movimientos-diarios')
  getMovimientosDiarios() {
    return this.reportesService.getMovimientosDiarios();
  }
}
