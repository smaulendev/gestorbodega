import {
  Injectable,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { RolUsuario } from '../usuarios/entities/usuario.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RolUsuario[]>(
      ROLES_KEY,
      [ctx.getHandler(), ctx.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // si no se definieron roles, no se restringe
    }

    const request = ctx.switchToHttp().getRequest();
    const user = request.user; // viene del JwtStrategy

    if (!user) return false;

    return requiredRoles.includes(user.rol);
  }
}
