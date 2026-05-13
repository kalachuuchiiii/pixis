import {
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { User } from './entities/user.entity';
import { Repository, type FindOneOptions } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import fs from 'fs-extra';

import { withCooldown } from '@/common/utils/cooldown.util';
import ms from 'ms';
import type { AuthUser } from '../auth/schemas/auth.schemas';
import nestql from 'nestql';
import { UploadsService } from '../uploads/uploads.service';
import type { UploadApiResponse } from 'cloudinary';
import type { UpdateUserForm } from '@pixis/schemas';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private readonly uploadsService: UploadsService,
  ) {}

  async uploadAndSaveAvatar({
    userId,
    file,
  }: {
    userId: number;
    file: Express.Multer.File;
  }) {
    const uploadResult = await this.uploadsService.uploadImage(file);
    const saveResult = await this.saveAvatar({
      userId,
      uploadResult,
    });
    await fs.remove(file.path);
    return {
      uploadResult,
      saveResult,
    };
  }

  async saveAvatar({
    userId,
    uploadResult,
  }: {
    userId: number;
    uploadResult: UploadApiResponse;
  }) {
    const myUser = await this.userRepo.findOne({ where: { id: userId } });
    if (!myUser) {
      throw new NotFoundException({
        message: 'User not found',
        code: 'USER_NOT_FOUND',
      });
    }

    if (!myUser.avatarPublicId) {
      myUser.avatarPublicId = uploadResult.public_id;
      myUser.avatarUrl = uploadResult.secure_url;
      return await this.userRepo.save(myUser);
    }

    await this.uploadsService.destroyImage(myUser.avatarPublicId);
    myUser.avatarPublicId = uploadResult.public_id;
    myUser.avatarUrl = uploadResult.secure_url;
    return await this.userRepo.save(myUser);
  }

  async findByUsername(username: string, options: FindOneOptions<User> = {}) {
    return await this.userRepo.findOne({ where: { username }, ...options });
  }

  async getUserById(userId: number) {
    //point, streak, averageAccuracy, deckStudiedCount, flashcardAnsweredCount, rank;

    const qb = this.userRepo
      .createQueryBuilder('user')

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
        `DENSE_RANK() OVER (ORDER BY COALESCE(SUM(point.currentPoints)::int, 0) DESC, COALESCE(AVG(session.accuracy)::float, 0) DESC )::int`,
        'user_rank',
      )
      .groupBy('user.id')
      .addGroupBy('point.id')
      .addGroupBy('streak.id');

    const userStats = await this.userRepo
      .createQueryBuilder()
      .select('*')
      .from(`(${qb.getQuery()})`, 'leaderboard')
      .where('leaderboard.user_id = :userId', { userId })
      .getRawOne();

    if (!userStats) {
      throw new UnauthorizedException({
        message: 'User not found.',
        code: 'USER_NOT_FOUND',
      });
    }

    const mappedResult = {
      ...nestql(userStats, { prefix: 'user' }),
      point: nestql(userStats, { prefix: 'point' }),
      streak: nestql(userStats, { prefix: 'streak' }),
    };
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
    const myUser = await this.userRepo.findOne({ where: { id: user.id } });

    if (!myUser) {
      throw new NotFoundException({
        message: 'User not found',
        code: 'USER_NOT_FOUND',
      });
    }
    if (myUser.avatarPublicId) {
      await this.uploadsService.destroyImage(myUser.avatarPublicId);
    }

    const result = await this.userRepo.remove(myUser);
    return result;
  }
}
