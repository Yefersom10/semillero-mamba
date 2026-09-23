import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsBoolean,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateUsuarioDto {
  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nombre!: string;

  @ApiProperty({
    description: 'Correo electrónico único',
    example: 'usuario@correo.com',
  })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  email!: string;

  @ApiProperty({
    description: 'Contraseña en texto plano',
    example: 'Secret123!',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password!: string;

  @ApiPropertyOptional({ description: 'ID del rol asignado', example: 1 })
  @IsInt()
  @IsOptional()
  rol_id?: number;

  @ApiPropertyOptional({
    description: 'Estado activo del usuario',
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}
