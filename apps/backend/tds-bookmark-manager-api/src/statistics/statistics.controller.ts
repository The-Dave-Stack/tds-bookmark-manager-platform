/**
 * statistics.controller.ts
 *
 * Purpose:
 * - Handles incoming HTTP requests related to application statistics.
 *
 * Logic Overview:
 * - Provides an endpoint for retrieving administrative statistics.
 * - Protects the endpoint with JWT authentication and role-based authorization (only 'ADMIN' role).
 *
 * Last Updated:
 * 2025-07-15 by AI Assistant
 */

import { Controller, Get, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Role } from '@tds/tds-bm-common';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { StatisticsService } from './statistics.service';

/**
 * Controller for handling statistics-related API requests.
 * All endpoints in this controller are protected by `JwtAuthGuard` and `RolesGuard`.
 */
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('statistics')
export class StatisticsController {
    constructor(private readonly statisticsService: StatisticsService) {}

    /**
     * GET /api/v1/statistics/admin
     * Retrieves administrative statistics for the application.
     * This endpoint requires the authenticated user to have the 'ADMIN' role.
     * @returns {Promise<object>} An object containing various administrative statistics.
     */
    @Get('admin')
    @Roles(Role.ADMIN)
    getAdminStatistics() {
        return this.statisticsService.getAdminStatistics();
    }
}
