import { Module } from '@nestjs/common';
import { Client } from 'pg';

import { DbClientService } from './db-client/db-client.service';
import { DB_CLIENT } from './db-client/db-client.token';

const env = process.env;

@Module({
  providers: [
    {
      provide: DB_CLIENT,
      useFactory: () => {
        return new Client({
          user: env.POSTGRES_USER,
          host: env.POSTGRES_HOST,
          password: env.POSTGRES_PASSWORD,
          database: env.POSTGRES_DATABASE,
          port: +env.POSTGRES_PORT,
          ssl:
            env.POSTGRES_SSL === 'true' ? { rejectUnauthorized: false } : false,
        });
      },
    },
    DbClientService,
  ],
  exports: [DbClientService],
})
export class DbModule {}
