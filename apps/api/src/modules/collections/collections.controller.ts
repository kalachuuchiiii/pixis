import { Body, Controller, Delete, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import type { Request } from 'express';

@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Post('/')
  async createCollection(@Req() request: Request) {}


  @Delete('/:collectionId')
  @UseGuards()
  async softDeleteCollection(@Req() request: Request) {}

  @Delete('/:collectionId/permanent')
  async deleteCollection(@Req() request: Request) {}

  @Patch('/:collectionId')
  async updateCollection(@Req() request: Request) {}


  @Patch('/:collectionId/restore')
  async restoreCollection(@Req() request: Request) {}



}
