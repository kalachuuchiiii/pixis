import type { Collection } from '@/modules/collections/entities/collection.entity';
import type { Deck } from '@/modules/deck/entities/deck.entity';
import {
  SEARCHABLE_DECK_FIELDS,
  SORTABLE_COLLECTION_FIELDS,
  SORTABLE_DECK_FIELDS,
} from '@pixis/constants';
import { FilterOperator, type PaginateConfig } from 'nestjs-paginate';

export const deckPaginationConfig: PaginateConfig<Deck> = {
  sortableColumns: [...SORTABLE_DECK_FIELDS],
  searchableColumns: [...SEARCHABLE_DECK_FIELDS],
  filterableColumns: {
    createdAt: [FilterOperator.GTE, FilterOperator.LTE, FilterOperator.BTW],
    updatedAt: [FilterOperator.GTE, FilterOperator.LTE, FilterOperator.EQ],
    visibility: [FilterOperator.EQ],
  },
  defaultLimit: 10,
  defaultSortBy: [['createdAt', 'DESC']],
};

export const collectionPaginationConfig: PaginateConfig<Collection> = {
  sortableColumns: [...SORTABLE_COLLECTION_FIELDS],
  filterableColumns: {
    createdAt: [FilterOperator.GTE, FilterOperator.BTW],
    visibility: [FilterOperator.EQ],
  },
  searchableColumns: ['name'],
};
