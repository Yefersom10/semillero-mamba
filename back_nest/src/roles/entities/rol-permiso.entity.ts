import { Rol } from './role.entity'; // Asegúrate del nombre exacto del archivo (.rol o .role)
import { Permiso } from './permiso.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity('roles_permisos')
@Unique('uq_rol_permiso', ['rol_id', 'permiso_id'])
export class RolPermiso {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  rol_id!: number;

  @Column()
  permiso_id!: number;

  @ManyToOne(() => Rol, (rol) => rol.roles_permisos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'rol_id' }) // Mapea la relación a la columna de PostgreSQL
  rol!: Rol;

  @ManyToOne(() => Permiso, (permiso) => permiso.roles_permisos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'permiso_id' }) // Mapea la relación a la columna de PostgreSQL
  permiso!: Permiso;
}
