import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Carga de variables de entorno
  // FRONTEND_URL admite varios orígenes separados por coma
  const allowedOrigins = (
    process.env.FRONTEND_URL || 'http://localhost:3001,http://127.0.0.1:3001'
  )
    .split(',')
    .map((origin) => origin.trim().replace(/\/$/, ''))
    .filter(Boolean);
  const appPort = process.env.APP_PORT || 3000;

  // Habilitar CORS
  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Documentación Swagger
  const config = new DocumentBuilder()
    .setTitle('API Semillero Mamba')
    .setDescription('Documentación interactiva de los endpoints del backend')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(appPort, '0.0.0.0');
}
bootstrap();
