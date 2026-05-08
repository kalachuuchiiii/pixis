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
import nestql from 'nestql';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async findByUsername(username: string, options: FindOneOptions<User> = {}) {
    return await this.userRepo.findOne({ where: { username }, ...options });
  }

  async getUserById(userId: number) {
    const qb = this.userRepo
      .createQueryBuilder('user')
      .where('user.id = :userId', { userId })
      .leftJoinAndSelect('user.point', 'point')
      .leftJoinAndSelect('user.streak', 'streak')
      .leftJoin('user.progresses', 'progress')
      .leftJoin('progress.deck', 'deck')
      .leftJoin('user.sessions', 'session')
      .addSelect(
        'COALESCE(AVG(session.accuracy)::float, 0)::float',
        'user_average_accuracy',
      )
      .addSelect(
        'COALESCE(COUNT(distinct deck.id)::int, 0)::int',
        'user_deck_studied_count',
      )
      .addSelect(
        'COALESCE(COUNT(distinct progress.id)::int, 0)::int',
        'user_flashcard_answered_count',
      )
      .addSelect(
        `DENSE_RANK() OVER (ORDER BY COALESCE(SUM(session.totalPointsGained)::int, 0) DESC, COALESCE(AVG(session.accuracy)::float, 0) DESC )::int`,
        'user_rank',
      )
      .groupBy('user.id')
      .addGroupBy('point.id')
      .addGroupBy('streak.id');

    const result = await qb.getRawOne();
    console.log(result);
    if (!result) {
      throw new UnauthorizedException({
        message: 'User not found.',
        code: 'USER_NOT_FOUND',
      });
    }

    const mappedResult = {
      ...nestql(result, { prefix: 'user' }),
      point: nestql(result, { prefix: 'point' }),
      streak: nestql(result, { prefix: 'streak' }),
    };
    console.log(mappedResult);
    return mappedResult;
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
