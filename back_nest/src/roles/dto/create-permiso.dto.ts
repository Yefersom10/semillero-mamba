import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePermisoDto {
  @ApiProperty({ example: 'crear_proyectos' })
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @ApiProperty({ example: 'Proyectos' })
  @IsString()
  @IsNotEmpty()
  modulo!: string;

  @ApiProperty({ example: 'crear' })
  @IsString()
  @IsNotEmpty()
  accion!: string;
}
