import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import env from '@/config/env';
import { authUserSchema, type AuthUser } from '../schemas/auth.schemas';

export class AccessStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: env.ACCESS_TOKEN_SECRET,
      ignoreExpiration: false,
    });
  }

  validate(payload: AuthUser | any) {
    //hint to what it contains
    const user = authUserSchema.parse(payload);
    return user;
  }
}
