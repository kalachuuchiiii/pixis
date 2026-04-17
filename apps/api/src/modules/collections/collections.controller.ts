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
  authPayloadSchema,
  collectionFormSchema,
  collectionSchema,
  idSchema,
} from '@pixis/schemas';
import { AccessGuard } from '../auth/guards/access.guard';
import { Paginate, type PaginateQuery } from 'nestjs-paginate';
import z from 'zod';

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
      await this.collectionsService.getCollections({ query });
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
    const user = authPayloadSchema.parse(request.user);
    await this.collectionsService.getMyCollections({ query, user });
    return {
      message: 'Collection updated',
    };
  }

  @Post('/')
  @UseGuards(AccessGuard)
  async createCollection(@Req() request: Request) {
    const collectionForm = collectionFormSchema.parse(request.body);
    const user = authPayloadSchema.parse(request.user);
    await this.collectionsService.createCollection({ collectionForm, user });
    return {
      message: 'Collection updated',
    };
  }

  @Delete('/:collectionId')
  @UseGuards(AccessGuard)
  async softDeleteCollection(@Req() request: Request) {
    const collectionId = idSchema.parse(request.params.collectionId);
    const user = authPayloadSchema.parse(request.user);
    await this.collectionsService.softDeleteCollection({ collectionId, user });
    return {
      message: 'Collection deleted',
    };
  }

  @Delete('/:collectionId/permanent')
  @UseGuards(AccessGuard)
  async deleteCollection(@Req() request: Request) {
    const collectionId = idSchema.parse(request.params.collectionId);
    const user = authPayloadSchema.parse(request.user);
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
    const user = authPayloadSchema.parse(request.user);
    await this.collectionsService.updateCollection({ collectionForm, collectionId, user });
    return {
      message: 'Collection updated',
    };
  }

  @Patch('/:collectionId/restore')
  @UseGuards(AccessGuard)
  async restoreCollection(@Req() request: Request) {
    const collectionId = idSchema.parse(request.params.collectionId);
    const user = authPayloadSchema.parse(request.user);
    await this.collectionsService.restoreCollection({ collectionId, user });
    return {
      message: 'Collection restored',
    };
  }
}
