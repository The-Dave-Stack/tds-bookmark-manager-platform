import { Controller, Get, UseGuards, Patch, Param, ParseUUIDPipe, Body } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role, UpdateUserRoleDto, UserWithoutPassword } from '@tds/tds-bm-common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UsersService } from '../users/users.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin')
export class AdminController {
    constructor(private readonly usersService: UsersService) {}

    @Get('users')
    @Roles(Role.ADMIN)
    findAllUsers(): Promise<UserWithoutPassword[]> {
        return this.usersService.findAllForAdmin();
    }

    @Patch('users/:id/role')
    @Roles(Role.ADMIN)
    updateUserRole(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateUserRoleDto: UpdateUserRoleDto,
    ): Promise<UserWithoutPassword> {
        return this.usersService.updateRole(id, updateUserRoleDto.roles);
    }
}