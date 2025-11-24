import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario, RolUsuario } from './entities/usuario.entity';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
  ) {}

  findByEmail(email: string) {
    return this.usuarioRepo.findOne({ where: { email } });
  }

  findById(id: number) {
    return this.usuarioRepo.findOne({ where: { id } });
  }

  async crearUsuario(data: {
    nombre: string;
    email: string;
    passwordHash: string;
    rol: RolUsuario;
  }) {
    const usuario = this.usuarioRepo.create(data);
    return this.usuarioRepo.save(usuario);
  }

  findAll() {
    return this.usuarioRepo.find();
  }
}
