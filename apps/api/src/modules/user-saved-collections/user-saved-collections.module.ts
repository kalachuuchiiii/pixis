import { Module } from '@nestjs/common';
import { UserSavedCollectionsService } from './user-saved-collections.service';
import { UserSavedCollectionsController } from './user-saved-collections.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Collection } from '../collections/entities/collection.entity';
import { UserSavedCollection } from './entities/user-saved-collection.entity';

@Module({
  controllers: [UserSavedCollectionsController],
  providers: [UserSavedCollectionsService],
  imports: [TypeOrmModule.forFeature([Collection, UserSavedCollection])]
})
export class UserSavedCollectionsModule {}
