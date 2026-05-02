import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository, type FindOneOptions } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import type { UpdateUserForm } from '@pixis/schemas';
import { withCooldown } from '@/common/utils/cooldown.util';
import ms from 'ms';
import type { AuthUser } from '../auth/schemas/auth.schemas';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async findByUsername(username: string, options: FindOneOptions<User> = {}) {
    return await this.userRepo.findOne({ where: { username }, ...options });
  }

  async getProfile(user: AuthUser) {
    const result = await this.userRepo.findOne({
      where: { id: user.id },
      relations: ['point', 'streak'],
    });
    if (!result) {
      throw new UnauthorizedException({
        message: 'User not found.',
        code: 'USER_NOT_FOUND',
      });
    }
    return result;
  }

  async updateUser({ form, user }: { form: UpdateUserForm; user: AuthUser }) {
    const myUser = await this.userRepo.findOne({ where: { id: user.id } });
    if (!myUser) {
      throw new UnauthorizedException({
        message: 'User not found.',
        code: 'USER_NOT_FOUND',
      });
    }

    const usernameCooldown = await withCooldown(
      '14d',
      myUser.lastUsernameUpdate?.getTime(),
      () => {
        if (myUser.username === form.username) return;
        myUser.username = form.username;
        myUser.lastUsernameUpdate = new Date();
      },
    );

    if (!usernameCooldown.ok) {
      throw new HttpException(
        {
          message: `You can change your username again in ${ms(usernameCooldown.remainingMS, { long: true })}`,
        },
        429,
      );
    }

    const nicknameCooldown = await withCooldown(
      '7m',
      myUser.lastNicknameUpdate?.getTime(),
      () => {
        if (myUser.nickname === form.nickname) return;
        myUser.nickname = form.nickname;
        myUser.lastNicknameUpdate = new Date();
      },
    );

    if (!nicknameCooldown.ok) {
      throw new HttpException(
        {
          message: `You can change your nickname again in ${ms(nicknameCooldown.remainingMS, { long: true })}`,
        },
        429,
      );
    }

    const result = await this.userRepo.save(myUser);
    const { username, nickname, lastNicknameUpdate, lastUsernameUpdate } =
      result;
    return {
      username,
      nickname,
      lastNicknameUpdate,
      lastUsernameUpdate,
    };
  }

  async togglePrivacy(user: AuthUser) {
    const myUser = await this.userRepo.findOneBy({ id: user.id });
    if (!myUser) {
      throw new UnauthorizedException({
        message: 'User not found',
        code: 'USER_NOT_FOUND',
      });
    }
    const newValue = !!!myUser.isPrivate;
    myUser.isPrivate = newValue;
    await this.userRepo.save(myUser);

    return {
      isPrivate: newValue,
    };
  }

  async deleteAccount(user: AuthUser) {
    const result = await this.userRepo.delete({ id: user.id });
    if (result.affected === 0) {
      throw new UnauthorizedException({
        message: 'User not found.',
        code: 'USER_NOT_FOUND',
      });
    }
    return result;
  }
}
