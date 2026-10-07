import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthUserSchema, type AuthUser } from '../schemas/auth.schemas';

export class AccessStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.ACCESS_TOKEN_SECRET!,
      ignoreExpiration: false,
    });
  }

  validate(payload: AuthUser | any) {
    //hint to what it contains
    const user = AuthUserSchema.parse(payload);
    return user;
  }
}
