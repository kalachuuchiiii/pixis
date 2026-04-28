import { updateGlobalConfig } from 'nestjs-paginate';

updateGlobalConfig({
  defaultLimit: 10,
  defaultMaxLimit: 100,
});
