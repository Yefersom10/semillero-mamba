import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { RolesModule } from './roles/roles.module';
import { CatalogosModule } from './catalogos/catalogos.module';
import { ProyectosModule } from './proyectos/proyectos.module';
import { ProductosModule } from './productos/productos.module';
import { RelacionesModule } from './relaciones/relaciones.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SeedService } from './database/seed.service';

@Module({
  imports: [
    // 1. Configuración global de entorno
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 2. Conexión centralizada a PostgreSQL
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isDebug = configService.get('DEBUG');
        // Permite validar booleano true o string 'true' / '1'
        const isSyncEnabled =
          isDebug === true || isDebug === 'true' || isDebug === '1';

        return {
          type: 'postgres',
          url: configService.get<string>('DATABASE_URL'),
          autoLoadEntities: true,
          synchronize: isSyncEnabled,
        };
      },
    }),

    // 3. Módulos de dominio
    AuthModule,
    UsuariosModule,
    RolesModule,
    CatalogosModule,
    ProyectosModule,
    ProductosModule,
    RelacionesModule,
  ],
  controllers: [AppController],
  providers: [SeedService, AppService],
})
export class AppModule {}
