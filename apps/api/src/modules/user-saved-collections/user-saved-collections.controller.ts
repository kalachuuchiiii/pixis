import { Controller, Delete, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UserSavedCollectionsService } from './user-saved-collections.service';
import type { Request } from 'express';
import { AccessGuard } from '../auth/guards/access.guard';
import { CollectionSchema, IDSchema } from '@pixis/schemas';
import { Paginate, type PaginateQuery } from 'nestjs-paginate';
import z from 'zod';
import { AuthUserSchema } from '../auth/schemas/auth.schemas';
import { Throttle } from '@nestjs/throttler';

@Controller('user-saved-collections')
export class UserSavedCollectionsController {
  constructor(
    private readonly userSavedCollectionsService: UserSavedCollectionsService,
  ) {}

  @Throttle({ default: { limit: 12, ttl: 60_000 } })
  @Post('/:collectionId/save')
  @UseGuards(AccessGuard)
  async saveCollection(@Req() request: Request) {
    const collectionId = IDSchema.parse(request.params.collectionId);
    const user = AuthUserSchema.parse(request.user);
    await this.userSavedCollectionsService.saveCollection({
      collectionId,
      user,
    });

    return {
      message: 'Collection saved!',
    };
  }

  @Throttle({ default: { limit: 12, ttl: 60_000 } })
  @Delete('/:collectionId/unsave')
  @UseGuards(AccessGuard)
  async unsaveCollection(@Req() request: Request) {
    const collectionId = IDSchema.parse(request.params.collectionId);
    const user = AuthUserSchema.parse(request.user);
    await this.userSavedCollectionsService.unsaveCollection({
      collectionId,
      user,
    });

    return {
      message: 'Collection unsaved!',
    };
  }

  @Get('/')
  @UseGuards(AccessGuard)
  async getSavedCollections(
    @Req() request: Request,
    @Paginate() query: PaginateQuery,
  ) {
    const user = AuthUserSchema.parse(request.user);
    const { data, nextPage } =
      await this.userSavedCollectionsService.getSavedCollections({
        user,
        query,
      });
    const collections = z.array(CollectionSchema).parse(data);
    return {
      collections,
      nextPage,
    };
  }
}
