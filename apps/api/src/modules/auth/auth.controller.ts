import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { LocalGuard } from './guards/local.guard';
import { RefreshGuard } from './guards/refresh.guard';
import {
  signUpFormSchema,
  updatePasswordFormSchema,
  updateUserFormSchema,
} from '@pixis/schemas';
import ms from 'ms';
import env from '@/config/env';
import { AccessGuard } from './guards/access.guard';
import type { Request, Response } from 'express';
import { authUserSchema } from './schemas/auth.schemas';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signUp(@Req() req) {
    const form = signUpFormSchema.parse(req.body);
    const value = await this.authService.signUp(form);
    return value;
  }

  @Post('/signin')
  @UseGuards(LocalGuard)
  async signIn(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = authUserSchema.parse(request.user);
    const { refreshToken, payload } = await this.authService.signIn(user);
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: env.NODE_ENV === 'production',
      maxAge: ms(env.REFRESH_TOKEN_TTL),
      path: '/',
    });

    return {
      payload,
    };
  }

  @Post('/refresh')
  @UseGuards(RefreshGuard)
  async refresh(@Req() request: Request) {
    const user = authUserSchema.parse(request.user);
    return this.authService.refresh(user);
  }

  @Post('/signout')
  async signOut(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: env.NODE_ENV === 'production',
      path: '/',
    });

    return {
      message: 'Signed out successfully!',
    };
  }

  @Patch('/me/password')
  @UseGuards(AccessGuard)
  async updatePassword(@Req() request: Request) {
    const user = authUserSchema.parse(request.user);
    const form = updatePasswordFormSchema.parse(request.body);
    const result = await this.authService.updatePassword(user, form);

    return {
      message: 'Successfully updated your password!',
      code: 'SUCCESSFULLY_UPDATED_PASSWORD',
    };
  }
}
