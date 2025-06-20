import { Controller, Get, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Role } from '@tds/tds-bm-common';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { StatisticsService } from './statistics.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('statistics')
export class StatisticsController {
    constructor(private readonly statisticsService: StatisticsService) {}

    @Get('admin')
    @Roles(Role.ADMIN)
    getAdminStatistics() {
        return this.statisticsService.getAdminStatistics();
    }
}