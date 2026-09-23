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
import { Rol } from '../../roles/entities/role.entity';
import { Proyecto } from '../../proyectos/entities/proyecto.entity';
import { ProyectoUsuario } from '../../relaciones/entities/proyecto-usuario.entity';
import { ProductoAutor } from '../../relaciones/entities/producto-autor.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 150 })
  nombre!: string;

  @Column({ length: 255, unique: true })
  email!: string;

  @Column({ type: 'text' })
  password_hash!: string;

  @Column({ nullable: true })
  rol_id!: number;

  @Column({ type: 'boolean', default: true })
  activo!: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  ultimo_login!: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at!: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deleted_at!: Date;

  @ManyToOne(() => Rol, (rol) => rol.usuarios, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'rol_id' })
  rol!: Rol;

  @OneToMany(() => Proyecto, (proyecto) => proyecto.creador)
  proyectos_creados!: Proyecto[];

  @OneToMany(() => ProyectoUsuario, (pu) => pu.usuario)
  proyecto_usuarios!: ProyectoUsuario[];

  @OneToMany(() => ProductoAutor, (pa) => pa.usuario)
  producto_autores!: ProductoAutor[];
}
