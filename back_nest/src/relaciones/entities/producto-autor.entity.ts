import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Producto } from '../../productos/entities/producto.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity('producto_autores')
@Unique('uq_producto_autor', ['producto_id', 'usuario_id'])
export class ProductoAutor {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  producto_id!: number;

  @Column()
  usuario_id!: number;

  @Column({ length: 50, nullable: true })
  rol_autor!: string;

  @Column({ type: 'boolean', default: false })
  es_autor_principal!: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;

  @ManyToOne(() => Producto, (p) => p.producto_autores, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'producto_id' })
  producto!: Producto;

  @ManyToOne(() => Usuario, (u) => u.producto_autores, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuario_id' })
  usuario!: Usuario;
}
