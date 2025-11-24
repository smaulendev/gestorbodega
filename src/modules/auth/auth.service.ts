import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsuariosService } from '../usuarios/usuarios.service';
import { RegisterUsuarioDto } from './dto/register-usuario.dto';
import { LoginDto } from './dto/login.dto';
import { RolUsuario } from '../usuarios/entities/usuario.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterUsuarioDto) {
    const { nombre, email, password, rol } = dto;

    const existe = await this.usuariosService.findByEmail(email);
    if (existe) {
      throw new ConflictException('El correo ya está registrado');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const usuario = await this.usuariosService.crearUsuario({
      nombre,
      email,
      passwordHash,
      rol,
    });

    return {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
    };
  }

  async login(dto: LoginDto) {
    const { email, password } = dto;

    const usuario = await this.usuariosService.findByEmail(email);
    if (!usuario) throw new UnauthorizedException('Credenciales inválidas');

    const passwordMatch = await bcrypt.compare(password, usuario.passwordHash);
    if (!passwordMatch) throw new UnauthorizedException('Credenciales inválidas');

    const payload = {
      sub: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
      nombre: usuario.nombre,
    };

    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    };
  }

  async me(user: any) {
    return user;
  }
}
