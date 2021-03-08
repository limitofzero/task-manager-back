import { Module } from '@nestjs/common';
import * as Redis from 'ioredis';

import { KeyValueStoreService, REDIS } from './key-value-store.service';

const providers = [
  {
    provide: REDIS,
    useFactory: () => {
      return null;
    },
  },
  KeyValueStoreService,
];

@Module({
  providers: providers,
  exports: [KeyValueStoreService],
})
export class RedisModule {}
