import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// 🔐 Seguridad y usuarios
import { AuthModule } from './modules/auth/auth.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { RolesModule } from './modules/roles/roles.module';
import { PermisosModule } from './modules/permisos/permisos.module';

// 🏭 Gestión de inventario y logística
import { ProductosModule } from './modules/productos/productos.module';
import { LotesModule } from './modules/lotes/lotes.module';
import { InventarioModule } from './modules/inventario/inventario.module';
import { BodegasModule } from './modules/bodegas/bodegas.module';
import { UbicacionesModule } from './modules/ubicaciones/ubicaciones.module';
import { PickingModule } from './modules/picking/picking.module';
import { TransferenciasModule } from './modules/transferencias/transferencias.module';
import { ReservasModule } from './modules/reservas/reservas.module';

// 📊 Monitoreo y trazabilidad
import { ReportesModule } from './modules/reportes/reportes.module';
import { NotificacionesModule } from './modules/notificaciones/notificaciones.module';
import { AuditoriaModule } from './modules/auditoria/auditoria.module';

@Module({
  imports: [
    // 🌍 Configuración global
    ConfigModule.forRoot({ isGlobal: true }),

    // 🗄️ Conexión a la base de datos PostgreSQL
TypeOrmModule.forRoot({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  autoLoadEntities: true,
  synchronize: true, // ⚠️ Solo en desarrollo
  logging: true,
}),


    // 🔐 Módulos de seguridad y acceso
    AuthModule,
    UsuariosModule,
    RolesModule,
    PermisosModule,

    // 🏭 Módulos de negocio (logística y stock)
    ProductosModule,
    LotesModule,
    InventarioModule,
    BodegasModule,
    UbicacionesModule,
    PickingModule,
    TransferenciasModule,
    ReservasModule,

    // 📊 Módulos de monitoreo, notificación y auditoría
    ReportesModule,
    NotificacionesModule,
    AuditoriaModule,
  ],
})
export class AppModule {}
