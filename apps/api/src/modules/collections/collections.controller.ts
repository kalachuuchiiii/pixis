import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CollectionsService } from './collections.service';
import type { Request } from 'express';
import {
  CollectionFormSchema,
  CollectionSchema,
  IDSchema,
} from '@pixis/schemas';
import { AccessGuard } from '../auth/guards/access.guard';
import { Paginate, type PaginateQuery } from 'nestjs-paginate';
import z from 'zod';
import { AuthUserSchema } from '../auth/schemas/auth.schemas';
import { Throttle } from '@nestjs/throttler';

@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Get('/explore')
  @UseGuards(AccessGuard)
  async exploreCollections(
    @Req() request: Request,
    @Paginate() query: PaginateQuery,
  ) {
    const { data, nextPage, totalItems } =
      await this.collectionsService.findAccessibleCollections({ query });
    const cleanCollections = z.array(CollectionSchema).parse(data);
    return {
      collections: cleanCollections,
      nextPage,
      totalItems,
    };
  }

  @Get('/:userId/list')
  @UseGuards(AccessGuard)
  async getCollections(
    @Req() request: Request,
    @Paginate() query: PaginateQuery,
  ) {
    const userId = IDSchema.parse(request.params.userId);
    const user = AuthUserSchema.parse(request.user);
    const { data, nextPage, totalItems } =
      await this.collectionsService.findAccessibleCollectionsByUserId({
        query,
        user,
        userId,
      });

    const cleanCollections = z.array(CollectionSchema).parse(data);
    return {
      collections: cleanCollections,
      nextPage,
      totalItems,
    };
  }

  @Throttle({ default: { limit: 12, ttl: 60_000 } })
  @Post('/')
  @UseGuards(AccessGuard)
  async createCollection(@Req() request: Request) {
    const collectionForm = CollectionFormSchema.parse(request.body);
    const user = AuthUserSchema.parse(request.user);
    await this.collectionsService.createCollection({ collectionForm, user });
    return {
      message: 'Collection created',
    };
  }

  @Throttle({ default: { limit: 6, ttl: 60_000 } })
  @Delete('/:collectionId/permanent')
  @UseGuards(AccessGuard)
  async deleteCollection(@Req() request: Request) {
    const collectionId = IDSchema.parse(request.params.collectionId);
    const user = AuthUserSchema.parse(request.user);
    await this.collectionsService.deleteCollection({ collectionId, user });
    return {
      message: 'Collection deleted',
    };
  }

  @Throttle({ default: { limit: 12, ttl: 60_000 } })
  @Patch('/:collectionId')
  @UseGuards(AccessGuard)
  async updateCollection(@Req() request: Request) {
    const collectionForm = CollectionFormSchema.parse(request.body);
    const collectionId = IDSchema.parse(request.params.collectionId);
    const user = AuthUserSchema.parse(request.user);
    await this.collectionsService.updateCollection({
      collectionForm,
      collectionId,
      user,
    });
    return {
      message: 'Collection updated',
    };
  }

  @Get('/:collectionId')
  @UseGuards(AccessGuard)
  async getCollection(@Req() request: Request) {
    const collectionId = IDSchema.parse(request.params.collectionId);
    const user = AuthUserSchema.parse(request.user);
    const collection =
      await this.collectionsService.findAccessibleCollectionById({
        collectionId,
        user,
      });

    const cleanCollection = CollectionSchema.parse(collection);
    return {
      collection: cleanCollection,
    };
  }
}
