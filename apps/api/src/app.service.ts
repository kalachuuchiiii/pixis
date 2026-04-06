import { Get, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import type { Logger } from 'winston';
import type { User } from './modules/users/entities/user.entity';

@Injectable()
export class AppService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  getHello(): string {
    this.logger.info('paris liam dude');
    return 'Hello   s!';
  }
}
