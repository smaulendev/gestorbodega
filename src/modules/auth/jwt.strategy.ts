import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'super_secreto_cambia_esto',
    });
  }

  async validate(payload: any) {
    // lo que retornes aquí será request.user
    return {
      id: payload.sub,
      email: payload.email,
      rol: payload.rol,
      nombre: payload.nombre,
    };
  }
}
