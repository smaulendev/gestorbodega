import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUsuarioDto } from './dto/register-usuario.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';
import { RolUsuario } from '../usuarios/entities/usuario.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ⚠ Para la primera prueba puedes dejarlo sin guards.
  // Idealmente SOLO ADMIN podría crear usuarios.
  @Post('register')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(RolUsuario.ADMIN)
  register(@Body() dto: RegisterUsuarioDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() req: any) {
    return this.authService.me(req.user);
  }
}
