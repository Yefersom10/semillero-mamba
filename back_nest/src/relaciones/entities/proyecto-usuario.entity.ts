import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Proyecto } from '../../proyectos/entities/proyecto.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity('proyecto_usuarios')
@Unique('uq_proyecto_usuario', ['proyecto_id', 'usuario_id'])
export class ProyectoUsuario {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  proyecto_id!: number;

  @Column()
  usuario_id!: number;

  @Column({ length: 50, nullable: true })
  rol_en_proyecto!: string;

  @Column({ type: 'timestamptz', nullable: true })
  fecha_ingreso!: Date;

  @Column({ type: 'timestamptz', nullable: true })
  fecha_salida!: Date;

  @Column({ type: 'boolean', default: true })
  activo!: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at!: Date;

  @ManyToOne(() => Proyecto, (p) => p.proyecto_usuarios, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'proyecto_id' })
  proyecto!: Proyecto;

  @ManyToOne(() => Usuario, (u) => u.proyecto_usuarios, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuario_id' })
  usuario!: Usuario;
}
