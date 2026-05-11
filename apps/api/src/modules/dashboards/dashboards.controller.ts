import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AccessGuard } from '../auth/guards/access.guard';
import type { Request } from 'express';
import { AuthUserSchema } from '../auth/schemas/auth.schemas';
import { DashboardsService } from './dashboards.service';
import { DashboardSchema } from '@pixis/schemas';

@Controller('dashboards')
export class DashboardsController {
  constructor(private readonly dashboardsService: DashboardsService) {}

  @Get()
  @UseGuards(AccessGuard)
  async getDashboard(@Req() request: Request) {
    const user = AuthUserSchema.parse(request.user);
    const result = await this.dashboardsService.getDashboardData(user.id);

    const dashboard = DashboardSchema.parse(result);

    return {
      dashboard,
    };
  }
}
