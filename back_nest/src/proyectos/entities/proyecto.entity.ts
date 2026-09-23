import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { ProyectoUsuario } from '../../relaciones/entities/proyecto-usuario.entity';
import { Producto } from '../../productos/entities/producto.entity';

@Entity('proyectos')
export class Proyecto {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 200 })
  nombre!: string;

  @Column({ type: 'text', nullable: true })
  descripcion!: string;

  @Column({ type: 'text', nullable: true })
  imagen_url!: string;

  @Column({ type: 'text', nullable: true })
  link_proyecto!: string;

  @Column({ length: 50, default: 'activo' })
  estado!: string;

  @Column({ type: 'timestamptz', nullable: true })
  fecha_inicio!: Date;

  @Column({ type: 'timestamptz', nullable: true })
  fecha_fin!: Date;

  @Column({ nullable: true })
  creado_por!: number;

  @Column({ type: 'boolean', default: true })
  activo!: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at!: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deleted_at!: Date;

  @ManyToOne(() => Usuario, (u) => u.proyectos_creados, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'creado_por' })
  creador!: Usuario;

  @OneToMany(() => ProyectoUsuario, (pu: ProyectoUsuario) => pu.proyecto)
  proyecto_usuarios!: ProyectoUsuario[];

  @OneToMany(() => Producto, (producto) => producto.proyecto)
  productos!: Producto[];
}
