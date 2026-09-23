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
import { TipoProducto } from '../../catalogos/entities/tipo-producto.entity';
import { Proyecto } from '../../proyectos/entities/proyecto.entity';
import { ProductoAutor } from '../../relaciones/entities/producto-autor.entity';

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  tipo_producto_id!: number;

  @Column()
  proyecto_id!: number;

  @Column({ length: 300 })
  titulo!: string;

  @Column({ type: 'text', nullable: true })
  descripcion!: string;

  @Column({ length: 50, default: 'en_proceso' })
  estado!: string;

  @Column({ nullable: true })
  anio_produccion!: number;

  @Column({ type: 'text', nullable: true })
  url_evidencia!: string;

  @Column({ length: 100, nullable: true })
  doi!: string;

  @Column({ type: 'boolean', default: true })
  activo!: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at!: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deleted_at!: Date;

  @ManyToOne(() => TipoProducto, (tipo: TipoProducto) => tipo.productos, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'tipo_producto_id' })
  tipo_producto!: TipoProducto;

  @ManyToOne(() => Proyecto, (proyecto) => proyecto.productos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'proyecto_id' })
  proyecto!: Proyecto;

  @OneToMany(
    () => ProductoAutor,
    (productoAutor: ProductoAutor) => productoAutor.producto,
  )
  producto_autores!: ProductoAutor[];
}
