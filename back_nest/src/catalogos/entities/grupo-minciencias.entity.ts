import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { TipoProducto } from './tipo-producto.entity';

@Entity('grupos_minciencias')
export class GrupoMinciencias {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true, length: 150, unique: true })
  nombre!: string;

  @Column({ type: 'text', nullable: true })
  descripcion!: string;

  @Column({ type: 'boolean', default: true })
  activo!: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at!: Date;

  @OneToMany(() => TipoProducto, (tipo) => tipo.grupo)
  tipos_producto!: TipoProducto[];
}
