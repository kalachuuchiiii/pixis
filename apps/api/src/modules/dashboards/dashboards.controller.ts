import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AccessGuard } from '../auth/guards/access.guard';
import type { Request } from 'express';
import { authUserSchema } from '../auth/schemas/auth.schemas';
import { DashboardsService } from './dashboards.service';
import { dashboardSchema } from '@pixis/schemas';

@Controller('dashboards')
export class DashboardsController {
  constructor(private readonly dashboardsService: DashboardsService) {}

  @Get()
  @UseGuards(AccessGuard)
  async getDashboard(@Req() request: Request) {
    const user = authUserSchema.parse(request.user);
    const result = await this.dashboardsService.getDashboardData(user.id);
    console.log(result);
    const dashboard = dashboardSchema.parse(result);
    console.log(dashboard);
    return {
      dashboard,
    };
  }
}
