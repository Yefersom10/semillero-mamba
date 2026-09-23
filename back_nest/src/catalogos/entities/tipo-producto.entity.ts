import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { GrupoMinciencias } from './grupo-minciencias.entity';
import { Producto } from '../../productos/entities/producto.entity';

@Entity('tipos_producto')
export class TipoProducto {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  grupo_id!: number;

  @Column({ length: 150, unique: true })
  nombre!: string;

  @Column({ type: 'text', nullable: true })
  descripcion!: string;

  @Column({ type: 'boolean', default: true })
  activo!: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at!: Date;

  @ManyToOne(() => GrupoMinciencias, (grupo) => grupo.tipos_producto, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'grupo_id' })
  grupo!: GrupoMinciencias;

  @OneToMany(() => Producto, (producto) => producto.tipo_producto)
  productos!: Producto[];
}
