import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';

import { AccessGuard } from '../auth/guards/access.guard';
import type { Request, Response } from 'express';
import { AuthUserSchema } from '../auth/schemas/auth.schemas';
import { DeckService } from '../deck/deck.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UploadsService } from '../uploads/uploads.service';
import fs from 'fs-extra';
import env from '@/config/env';
import z from 'zod';
import { Throttle } from '@nestjs/throttler';
import {
  DeckSchema,
  IDSchema,
  UpdateUserFormSchema,
  UserWithStatsSchema,
} from '@pixis/schemas';
import { ImageInterceptor } from '../uploads/interceptors/uploads.interceptors';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly decksService: DeckService,
  ) {}

  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  @Patch()
  @UseGuards(AccessGuard)
  async updateUser(@Req() request: Request) {
    const user = AuthUserSchema.parse(request.user);
    const form = UpdateUserFormSchema.parse(request.body);

    const result = await this.usersService.updateUser({ user, form });
    return {
      message: 'Updated successfully!',
    };
  }

  @Get('/:userId/history')
  @UseGuards(AccessGuard)
  async getHistory(@Req() request: Request) {
    const user = AuthUserSchema.parse(request.user);
    const userId = IDSchema.catch(0).parse(request.params.userId);
    const lastThreeDecks =
      await this.decksService.getLatestDecksAnsweredByUserId({
        userId: userId || user.id,
        user,
      });
    const cleanDecks = z.array(DeckSchema).parse(lastThreeDecks);
    return {
      decks: cleanDecks,
    };
  }

  @Throttle({ default: { limit: 6, ttl: 60_000 } })
  @Post('/avatar')
  @UseGuards(AccessGuard)
  @UseInterceptors(ImageInterceptor('avatar'))
  async updateAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Req() request: Request,
  ) {
    const user = AuthUserSchema.parse(request.user);
    await this.usersService.uploadAndSaveAvatar({ userId: user.id, file });
    return {
      message: 'Avatar uploaded successfully!',
    };
  }

  @Get('/profile')
  @UseGuards(AccessGuard)
  async getMyProfile(@Req() request: Request) {
    const user = AuthUserSchema.parse(request.user);
    const result = await this.usersService.getUserById(user.id);
    const userWithStats = UserWithStatsSchema.parse(result);
    return {
      user: userWithStats,
    };
  }

  @Get('/:userId/profile')
  @UseGuards(AccessGuard)
  async getProfile(@Req() request: Request) {
    const userId = IDSchema.parse(request.params.userId);
    const result = await this.usersService.getUserById(userId);
    const userWithStats = UserWithStatsSchema.parse(result);
    return {
      user: userWithStats,
    };
  }

  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  @Patch('/privacy')
  @UseGuards(AccessGuard)
  async togglePrivacy(@Req() request: Request) {
    const user = AuthUserSchema.parse(request.user);
    const result = await this.usersService.togglePrivacy(user);
    const isPrivate = z.boolean().parse(result.isPrivate);
    return {
      isPrivate,
    };
  }

  @Throttle({ default: { limit: 1, ttl: 60_000 } })
  @Delete()
  @UseGuards(AccessGuard)
  async deleteAccount(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = AuthUserSchema.parse(request.user);
    await this.usersService.deleteAccount(user);

    response.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: env.NODE_ENV === 'production',
      path: '/',
    });
    return {
      message: `Deleted ${user.username}`,
    };
  }
}
