import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { RolPermiso } from './rol-permiso.entity';

@Entity('permisos')
export class Permiso {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  nombre!: string;

  @Column({ length: 100 })
  modulo!: string;

  @Column({ length: 100 })
  accion!: string;

  @OneToMany(() => RolPermiso, (rp) => rp.permiso)
  roles_permisos!: RolPermiso[];
}
