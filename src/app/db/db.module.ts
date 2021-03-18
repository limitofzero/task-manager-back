import { DynamicModule, Module } from '@nestjs/common';
import { Client } from 'pg';

const env = process.env;
export const DB_CLIENT = 'DB_CLIENT';

const providers = [
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
];

@Module({
  providers: [],
  exports: [],
})
export class DbModule {
  public static forRoot(): DynamicModule {
    return {
      module: DbModule,
      providers,
      exports: providers,
    };
  }

  public static forFeature(): DynamicModule {
    return {
      module: DbModule,
      providers,
      exports: providers,
    };
  }
}
