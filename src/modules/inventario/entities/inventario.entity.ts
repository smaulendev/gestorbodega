// // import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
// // import { Producto } from '../../productos/entities/producto.entity';

// // @Entity('inventario')
// // export class Inventario {
// //   @PrimaryGeneratedColumn()
// //   id: number;

// //   @Column('int')
// //   cantidadDisponible: number;

// //   @Column('int', { default: 0 })
// //   cantidadReservada: number;

// //   @Column({ default: 'Disponible' })
// //   estadoStock: string;

// //   @ManyToOne(() => Producto, (producto) => producto.inventario, { onDelete: 'CASCADE' })
// //   producto: Producto;
// // }

// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   ManyToOne,
//   JoinColumn,
// } from 'typeorm';
// import { Producto } from '../../productos/entities/producto.entity';
// import { Lote } from '../../lotes/entities/lote.entity';
// import { Bodega } from '../../bodegas/entities/bodega.entity';
// import { Ubicacion } from '../../ubicaciones/entities/ubicacion.entity';

// @Entity('inventario')
// export class Inventario {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column('int')
//   cantidadDisponible: number;

//   @Column('int', { default: 0 })
//   cantidadReservada: number;

//   @Column('int', { default: 0 })
//   cantidadTransito: number;

//   @Column({ default: 'Disponible' })
//   estadoStock: string; // Disponible | Crítico | Agotado | En tránsito

//   // PRODUCTO
//   @ManyToOne(() => Producto, (producto) => producto.inventario, {
//     onDelete: 'CASCADE',
//   })
//   @JoinColumn({ name: 'productoId' })
//   producto: Producto;

//   @Column()
//   productoId: number;

//   // LOTE
//   @ManyToOne(() => Lote, (lote) => lote.inventario, {
//     onDelete: 'CASCADE',
//   })
//   @JoinColumn({ name: 'loteId' })
//   lote: Lote;

//   @Column()
//   loteId: number;

//   // BODEGA
//   @ManyToOne(() => Bodega, (bodega) => bodega.inventario, {
//     onDelete: 'SET NULL',
//   })
//   @JoinColumn({ name: 'bodegaId' })
//   bodega: Bodega;

//   @Column({ nullable: true })
//   bodegaId: number;

//   // UBICACIÓN
//   @ManyToOne(() => Ubicacion, (ubicacion) => ubicacion.inventario, {
//     onDelete: 'SET NULL',
//   })
//   @JoinColumn({ name: 'ubicacionId' })
//   ubicacion: Ubicacion;

//   @Column({ nullable: true })
//   ubicacionId: number;
// }

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Producto } from '../../productos/entities/producto.entity';
import { Lote } from '../../lotes/entities/lote.entity';
import { Bodega } from '../../bodegas/entities/bodega.entity';
import { Ubicacion } from '../../ubicaciones/entities/ubicacion.entity';

@Entity('inventario')
export class Inventario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  cantidadDisponible: number;

  @Column('int', { default: 0 })
  cantidadReservada: number;

  @Column('int', { default: 0 })
  cantidadTransito: number;

  @Column({ default: 'Disponible' })
  estadoStock: string;

  // PRODUCTO
  @ManyToOne(() => Producto, (producto) => producto.inventario, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productoId' })
  producto: Producto;

  @Column()
  productoId: number;

  // LOTE
  @ManyToOne(() => Lote, (lote) => lote.inventario, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'loteId' })
  lote: Lote;

  @Column()
  loteId: number;

  // BODEGA
  @ManyToOne(() => Bodega, (bodega) => bodega.inventario)
  @JoinColumn({ name: 'bodegaId' })
  bodega: Bodega;

  @Column()
  bodegaId: number;

  // UBICACION
  @ManyToOne(() => Ubicacion, (ubicacion) => ubicacion.inventario)
  @JoinColumn({ name: 'ubicacionId' })
  ubicacion: Ubicacion;

  @Column()
  ubicacionId: number;

  @Column({ type: 'int', default: 0 })
cantidad: number;

}
