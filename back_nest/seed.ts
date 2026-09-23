import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { SeedService } from './src/database/seed.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seedService = app.get(SeedService);
  await seedService.run();
  await app.close();
}
bootstrap

// docker:
// docker compose up --build

//instalar dependencias:
//npm install

// correr el proyecto:
//npm run start:dev

//link for swagger verification:
// http://localhost:3000/api/docs