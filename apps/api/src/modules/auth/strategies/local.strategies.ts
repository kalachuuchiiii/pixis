import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/modules/users/entities/user.entity';
import { Repository } from 'typeorm';
import { UsersService } from '@/modules/users/users.service';
import { authUserSchema } from '../schemas/auth.schemas';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      usernameField: 'username',
      passwordField: 'password',
    });
  }

  async validate(username: string, password: string) {
    const user = await this.usersService.findByUsername(username, {
      relations: ['credential'],
      select: {
        username: true,
        id: true,
        pointId: true,
        streakId: true,
      },
    });
    if (!user)
      throw new BadRequestException({
        message: 'Invalid Credentials',
        code: 'INVALID_CREDENTIALS',
      });
    if (!user.credential)
      throw new BadRequestException({
        message: 'Invalid Credentials',
        code: 'INVALID_CREDENTIALS',
      });
    const isPasswordCorrect = await user.credential.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new BadRequestException({
        message: 'Invalid Credentials',
        code: 'INVALID_CREDENTIALS',
      });
    }
    const data = authUserSchema.strip().parse(user);
    return data;
  }
}
