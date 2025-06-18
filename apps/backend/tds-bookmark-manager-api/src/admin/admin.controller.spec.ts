import { Test, TestingModule } from '@nestjs/testing';

import { AdminController } from './admin.controller';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UsersService } from '../users/users.service';
import { of } from 'rxjs';

describe('AdminController', () => {
  let controller: AdminController;
  let usersService: UsersService;

  const mockUsersService = {
    findAllForAdmin: jest.fn(),
    updateRole: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
      ],
    })
    .overrideGuard(JwtAuthGuard).useValue({ canActivate: () => of(true) })
    .overrideGuard(RolesGuard).useValue({ canActivate: () => of(true) })
    .compile();

    controller = module.get<AdminController>(AdminController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should call usersService.findAllForAdmin', () => {
    controller.findAllUsers();
    expect(usersService.findAllForAdmin).toHaveBeenCalled();
  });

  it('should call usersService.updateRole with correct params', () => {
    const userId = 'user-uuid';
    const dto = { roles: ['ADMIN'] as any };
    controller.updateUserRole(userId, dto);
    expect(usersService.updateRole).toHaveBeenCalledWith(userId, dto.roles);
  });
});