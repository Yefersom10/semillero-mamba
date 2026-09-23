import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductoDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  tipo_producto_id!: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  proyecto_id!: number;

  @ApiProperty({ example: 'Desarrollo de red de sensores IoT' })
  @IsString()
  @IsNotEmpty()
  titulo!: string;

  @ApiPropertyOptional({ example: 'Detalles del producto de investigación' })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiPropertyOptional({ example: 'en_proceso' })
  @IsOptional()
  @IsString()
  estado?: string = 'en_proceso';

  @ApiPropertyOptional({ example: 2026 })
  @IsOptional()
  @IsInt()
  anio_produccion?: number;

  @ApiPropertyOptional({ example: 'https://evidencia.com/doc.pdf' })
  @IsOptional()
  @IsUrl()
  url_evidencia?: string;

  @ApiPropertyOptional({ example: '10.1000/182' })
  @IsOptional()
  @IsString()
  doi?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  activo?: boolean = true;
}
