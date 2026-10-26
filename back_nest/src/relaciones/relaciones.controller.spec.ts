import { Test, TestingModule } from '@nestjs/testing';
import { RelacionesController } from './relaciones.controller';
import { RelacionesService } from './relaciones.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';

describe('RelacionesController', () => {
  let controller: RelacionesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RelacionesController],
      // El servicio real depende de repositorios de TypeORM: se simula
      providers: [{ provide: RelacionesService, useValue: {} }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(PermissionsGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<RelacionesController>(RelacionesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
