import { PassportStrategy } from '@nestjs/passport';
import { authPayloadSchema } from '@pixis/schemas';
import type { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import env from '@/config/env';

export class AccessStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: env.ACCESS_TOKEN_SECRET,
      ignoreExpiration: false
    });
  }


  validate(payload: any){
    const user = authPayloadSchema.parse(payload);
    return user;
  }

}
