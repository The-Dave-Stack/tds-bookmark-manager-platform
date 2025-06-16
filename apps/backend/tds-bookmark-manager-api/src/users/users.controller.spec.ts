import { CreateUserDto, Role, User } from '@tds/tds-bm-common';
import { Test, TestingModule } from '@nestjs/testing';

import { CacheInterceptor } from '@nestjs/cache-manager';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

// Mock del UsersService: Simulamos lo que haría el servicio real.
const mockUsersService = {
  hasAdmins: jest.fn(),
  setupAdmin: jest.fn(),
};

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    })
      // Sobrescribimos el CacheInterceptor para que no interfiera en los tests
      .overrideInterceptor(CacheInterceptor)
      .useValue({
        intercept: jest.fn().mockImplementation((_context, next) => next.handle()),
      })
      .compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);

    // Limpiamos los mocks antes de cada test para asegurar que los tests son independientes
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('checkAdmins', () => {
    it('should return true if admin users exist', async () => {
      // Arrange: Configuramos el mock para que devuelva `true`
      mockUsersService.hasAdmins.mockResolvedValue(true);

      // Act & Assert: Llamamos al método y verificamos el resultado
      await expect(controller.checkAdmins()).resolves.toBe(true);

      // Assert: Nos aseguramos de que el método del servicio fue llamado
      expect(service.hasAdmins).toHaveBeenCalledTimes(1);
    });

    it('should return false if no admin users exist', async () => {
      // Arrange: Configuramos el mock para que devuelva `false`
      mockUsersService.hasAdmins.mockResolvedValue(false);

      // Act & Assert
      await expect(controller.checkAdmins()).resolves.toBe(false);

      // Assert
      expect(service.hasAdmins).toHaveBeenCalledTimes(1);
    });
  });

  describe('setupAdmin', () => {
    it('should call setupAdmin in the service and return the new admin user', async () => {
      // Arrange: Preparamos los datos de entrada (DTO) y el usuario que esperamos como resultado
      const createUserDto: CreateUserDto = {
        username: 'admin',
        password: 'supersecretpassword',
        email: 'admin@thedavestack.com',
        firstName: 'Admin',
        lastName: 'User',
      };

      const expectedAdminUser: User = {
        username: 'admin',
        email: 'admin@thedavestack.com',
        firstName: 'Admin',
        lastName: 'User',
        isActive: true,
        roles: ['ADMIN' as Role, 'USER' as Role],
        createdAt: new Date(),
      };

      // Configuramos el mock para que devuelva nuestro usuario esperado
      mockUsersService.setupAdmin.mockResolvedValue(expectedAdminUser);

      // Act: Llamamos al método del controlador
      const result = await controller.setupAdmin(createUserDto);

      // Assert: Verificamos que el resultado es el esperado
      expect(result).toEqual(expectedAdminUser);
      expect(result.roles).toContain('ADMIN');

      // Assert: Nos aseguramos de que el método del servicio fue llamado con los datos correctos
      expect(service.setupAdmin).toHaveBeenCalledWith(createUserDto);
      expect(service.setupAdmin).toHaveBeenCalledTimes(1);
    });
  });
});