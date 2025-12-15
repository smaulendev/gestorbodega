import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity'; // 👈 ajusta si es otra ruta
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { RolUsuario } from './rol.enum';
import * as bcrypt from 'bcrypt';


interface CrearUsuarioInput {
  nombre: string;
  email: string;
  password?: string;      // puede venir en texto plano
  passwordHash?: string;  // o ya hasheado desde AuthService
  rol?: RolUsuario;
}

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuariosRepo: Repository<Usuario>,
  ) {}

  // ==============================
  // FIND ALL (para /usuarios)
  // ==============================
  async findAll(): Promise<Usuario[]> {
    return this.usuariosRepo.find({
      order: { id: 'ASC' },
    });
  }

  // ==============================
  // FIND BY ID
  // ==============================
  async findById(id: number): Promise<Usuario> {
    const usuario = await this.usuariosRepo.findOne({ where: { id } });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return usuario;
  }

  // ==============================
  // FIND BY EMAIL (usado por AuthService)
  // ==============================
  async findByEmail(email: string): Promise<Usuario | null> {
    return this.usuariosRepo.findOne({ where: { email } });
  }

  // ==============================
  // CREAR USUARIO (usado por AuthService)
  // ==============================
  async crearUsuario(data: CrearUsuarioInput): Promise<Usuario> {
    const { nombre, email, password, passwordHash, rol } = data;

    let finalHash = passwordHash;

    if (!finalHash) {
      if (!password) {
        throw new Error('Password requerido para crear usuario');
      }
      finalHash = await bcrypt.hash(password, 10);
    }

    const nuevo = this.usuariosRepo.create({
      nombre,
      email,
      passwordHash: finalHash,
      rol: rol ?? RolUsuario.OPERARIO,
      // activo: true  // si tienes esta columna en el entity, queda activa por defecto
    });

    return await this.usuariosRepo.save(nuevo);
  }

  // ==============================
  // UPDATE (para admin: rol, nombre, activo, etc.)
  // ==============================
  async update(id: number, dto: UpdateUsuarioDto): Promise<Usuario> {
    const usuario = await this.findById(id);

    Object.assign(usuario, dto);

    return await this.usuariosRepo.save(usuario);
  }

  // ==============================
  // DESACTIVAR (soft delete desde DELETE /usuarios/:id)
  // ==============================
  async desactivar(id: number): Promise<Usuario> {
    const usuario = await this.findById(id);

    // si tienes columna "activo" en el entity:
    (usuario as any).activo = false;

    return await this.usuariosRepo.save(usuario);
  }
}
