import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Credential } from './entities/credential.entity';
import { User } from '../users/entities/user.entity';
import { DataSource, Repository, type FindOneOptions } from 'typeorm';
import { Point } from '../users/entities/point.entity';
import { Streak } from '../users/entities/streak.entity';
import { type SignUpForm, type UpdatePasswordForm } from '@pixis/schemas';
import { hashPassword } from '@/common/utils/hash.util';
import type { AuthUser } from './schemas/auth.schemas';
import type ms from 'ms';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Credential)
    private readonly credentialRepo: Repository<Credential>,
    private readonly datasource: DataSource,
    private readonly jwtService: JwtService,
  ) { }

  async findUserByUsername(
    username: string,
    options: FindOneOptions<User> = {},
  ) {
    const query: FindOneOptions<User> = { where: { username }, ...options };
    const user = await this.userRepo.findOne(query);
    return user;
  }

  async signUp({ username, password }: SignUpForm) {
    const user = await this.findUserByUsername(username);
    if (user) {
      throw new ConflictException('This username is already taken.');
    }
    return await this.datasource.transaction(async (manager) => {
      const user = manager.create(User, { username });
      await manager.save(User, user);
      const credential = manager.create(Credential, {
        user: { id: user.id },
        password,
      });
      const point = manager.create(Point, { user: { id: user.id } });
      const streak = manager.create(Streak, { user: { id: user.id } });

      await manager.save(Credential, credential);
      await manager.save(Point, point);
      await manager.save(Streak, streak);

      return {
        user,
        credential,
        point,
        streak,
      };
    });
  }

  async signIn(payload: AuthUser) {
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: process.env.REFRESH_TOKEN_TTL! as ms.StringValue,
      secret: process.env.REFRESH_TOKEN_SECRET! as string,
    });

    return {
      refreshToken,
      payload,
    };
  }

  async refresh(authPayload: AuthUser) {
    const accessToken = await this.jwtService.signAsync(authPayload, {
      expiresIn: process.env.ACCESS_TOKEN_TTL! as ms.StringValue,
      secret: process.env.ACCESS_TOKEN_SECRET!,
    });
    return {
      accessToken,
    };
  }

  async updatePassword(user: AuthUser, form: UpdatePasswordForm) {
    const myUser = await this.userRepo.findOne({
      where: { id: user.id },
      relations: ['credential'],
    });

    if (!myUser || !myUser.credential) {
      throw new UnauthorizedException({
        message: 'User not found',
        code: 'USER_NOT_FOUND',
      });
    }

    const isPasswordCorrect = await myUser.credential.comparePassword(
      form.oldPassword,
    );

    if (!isPasswordCorrect) {
      throw new BadRequestException({
        message: 'Incorrect Password',
        code: 'INCORRECT_PASSWORD',
      });
    }

    myUser.credential.password = await hashPassword(form.newPassword);
    return await this.credentialRepo.save(myUser.credential);
  }
}
