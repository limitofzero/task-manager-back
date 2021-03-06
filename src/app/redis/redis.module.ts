import { Module } from '@nestjs/common';
import * as Redis from 'ioredis';

import { KeyValueStoreService, REDIS } from './key-value-store.service';

const providers = [
  {
    provide: REDIS,
    useFactory: () => {
      return new Redis({
        port: +process.env.REDIS_PORT,
        host: process.env.REDIS_HOST,
      });
    },
  },
  KeyValueStoreService,
];

@Module({
  providers: providers,
  exports: [KeyValueStoreService],
})
export class RedisModule {}
