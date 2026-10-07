import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthUserSchema } from '../schemas/auth.schemas';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request?.cookies?.['refreshToken'] ?? null,
      ]),
      secretOrKey: process.env.REFRESH_TOKEN_SECRET!,
      passReqToCallback: true,
      ignoreExpiration: false,
    });
  }

  async validate(_req: Request, payload: any) {
    return AuthUserSchema.parse(payload);
  }
}
