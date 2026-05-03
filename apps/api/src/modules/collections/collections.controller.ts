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
  collectionFormSchema,
  collectionSchema,
  idSchema,
} from '@pixis/schemas';
import { AccessGuard } from '../auth/guards/access.guard';
import { Paginate, type PaginateQuery } from 'nestjs-paginate';
import z from 'zod';
import { authUserSchema } from '../auth/schemas/auth.schemas';

@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Get('/explore')
  @UseGuards(AccessGuard)
  async getCollections(
    @Req() request: Request,
    @Paginate() query: PaginateQuery,
  ) {
    const { data, nextPage, totalItems } =
      await this.collectionsService.findAccessibleCollections({ query });
    const cleanCollections = z.array(collectionSchema).parse(data);
    return {
      collections: cleanCollections,
      nextPage,
      totalItems,
    };
  }

  @Get('/')
  @UseGuards(AccessGuard)
  async getMyCollections(
    @Req() request: Request,
    @Paginate() query: PaginateQuery,
  ) {
    const user = authUserSchema.parse(request.user);
    const { data, nextPage, totalItems } =
      await this.collectionsService.findAccessibleCollections({ query, user });
    const cleanCollections = z.array(collectionSchema).parse(data);
    return {
      collections: cleanCollections,
      nextPage,
      totalItems,
    };
  }

  @Post('/')
  @UseGuards(AccessGuard)
  async createCollection(@Req() request: Request) {
    const collectionForm = collectionFormSchema.parse(request.body);
    const user = authUserSchema.parse(request.user);
    await this.collectionsService.createCollection({ collectionForm, user });
    return {
      message: 'Collection created',
    };
  }

  @Delete('/:collectionId/permanent')
  @UseGuards(AccessGuard)
  async deleteCollection(@Req() request: Request) {
    const collectionId = idSchema.parse(request.params.collectionId);
    const user = authUserSchema.parse(request.user);
    await this.collectionsService.deleteCollection({ collectionId, user });
    return {
      message: 'Collection deleted',
    };
  }

  @Patch('/:collectionId')
  @UseGuards(AccessGuard)
  async updateCollection(@Req() request: Request) {
    const collectionForm = collectionFormSchema.parse(request.body);
    const collectionId = idSchema.parse(request.params.collectionId);
    const user = authUserSchema.parse(request.user);
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
    const collectionId = idSchema.parse(request.params.collectionId);
    const user = authUserSchema.parse(request.user);
    const collection =
      await this.collectionsService.findAccessibleCollectionById({
        collectionId,
        user,
      });

    const cleanCollection = collectionSchema.parse(collection);
    return {
      collection: cleanCollection,
    };
  }
}
