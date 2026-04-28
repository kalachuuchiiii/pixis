import { Controller, Delete, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UserSavedCollectionsService } from './user-saved-collections.service';
import type { Request } from 'express';
import { AccessGuard } from '../auth/guards/access.guard';
import { authPayloadSchema, collectionSchema, idSchema } from '@pixis/schemas';
import { Paginate, type PaginateQuery } from 'nestjs-paginate';
import z from 'zod';

@Controller('user-saved-collections')
export class UserSavedCollectionsController {
  constructor(
    private readonly userSavedCollectionsService: UserSavedCollectionsService,
  ) {}

  @Post('/:collectionId/save')
  @UseGuards(AccessGuard)
  async saveCollection(@Req() request: Request) {
    const collectionId = idSchema.parse(request.params.collectionId);
    const user = authPayloadSchema.parse(request.user);
    await this.userSavedCollectionsService.saveCollection({
      collectionId,
      user,
    });

    return {
      message: 'Collection saved!',
    };
  }

  @Delete('/:collectionId/unsave')
  @UseGuards(AccessGuard)
  async unsaveCollection(@Req() request: Request) {
    const collectionId = idSchema.parse(request.params.collectionId);
    const user = authPayloadSchema.parse(request.user);
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
  async getMySavedCollections(@Req() request: Request, @Paginate() query: PaginateQuery ){
   const user = authPayloadSchema.parse(request.user);
   const { data, nextPage } = await this.userSavedCollectionsService.getSavedCollections({ user, query });
   const collections = z.array(collectionSchema).parse(data);
   return {
    collections,
    nextPage
   }
  }
}
