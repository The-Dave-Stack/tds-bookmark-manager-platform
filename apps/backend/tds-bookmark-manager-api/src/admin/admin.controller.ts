/**
 * admin.controller.ts
 *
 * Purpose:
 * - Handles incoming HTTP requests for administrative functionalities.
 *
 * Logic Overview:
 * - Provides endpoints for managing users (listing, updating roles).
 * - All endpoints are protected by JWT authentication and require the 'ADMIN' role.
 * - Delegates business logic to the `UsersService`.
 *
 * Last Updated:
 * 2025-07-16 by AI Assistant
 */

import { Controller, Get, UseGuards, Patch, Param, ParseUUIDPipe, Body } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role, UpdateUserRoleDto, UserWithoutPassword } from '@tds/tds-bm-common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UsersService } from '../users/users.service';

/**
 * Controller for handling administrative API requests.
 * All endpoints in this controller are protected by `JwtAuthGuard` and `RolesGuard`,
 * and require the authenticated user to have the `ADMIN` role.
 */
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin')
export class AdminController {
    constructor(private readonly usersService: UsersService) {}

    /**
     * GET /api/v1/admin/users
     * Retrieves a list of all registered users in the system.
     * Only accessible by users with the 'ADMIN' role.
     * @returns {Promise<UserWithoutPassword[]>} An array of user objects, excluding sensitive data.
     */
    @Get('users')
    @Roles(Role.ADMIN)
    findAllUsers(): Promise<UserWithoutPassword[]> {
        return this.usersService.findAllForAdmin();
    }

    /**
     * PATCH /api/v1/admin/users/:id/role
     * Updates the roles of a specific user.
     * Only accessible by users with the 'ADMIN' role.
     * @param {string} id - The UUID of the user whose roles are to be updated.
     * @param {UpdateUserRoleDto} updateUserRoleDto - The DTO containing the new roles for the user.
     * @returns {Promise<UserWithoutPassword>} The updated user object, excluding sensitive data.
     */
    @Patch('users/:id/role')
    @Roles(Role.ADMIN)
    updateUserRole(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateUserRoleDto: UpdateUserRoleDto,
    ): Promise<UserWithoutPassword> {
        return this.usersService.updateRole(id, updateUserRoleDto.roles);
    }
}
