import { Controller, Delete, Patch, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { authPayloadSchema, updateUserFormSchema } from '@pixis/schemas';
import { AccessGuard } from '../auth/guards/access.guard';
import type { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('/me')
  @UseGuards(AccessGuard)
  async updateUser(@Req() request: Request) {
    const user = authPayloadSchema.parse(request.user);
    const form = updateUserFormSchema.parse(request.body);

    return await this.usersService.updateUser({ user, form });
  }

  @Patch('/me/privacy')
  @UseGuards(AccessGuard)
  async toggleIsPrivate(@Req() request: Request) {
    const user = authPayloadSchema.parse(request.user);
    return await this.usersService.toggleIsPrivate(user);
  }

  @Delete('/me')
  @UseGuards(AccessGuard)
  async deleteAccount(@Req() request: Request) {
    const user = authPayloadSchema.parse(request.user);
    await this.usersService.deleteAccount(user);
    return {
      message: `Deleted ${user.username}`
    }
  }

}
