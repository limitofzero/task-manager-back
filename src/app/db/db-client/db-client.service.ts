import { Inject, Injectable } from '@nestjs/common';
import { Client } from 'pg';
import { Observable, defer, from, interval, timer } from 'rxjs';
import { map, mapTo, retryWhen, switchMap, switchMapTo } from 'rxjs/operators';

import { DB_CLIENT } from './db-client.token';

@Injectable()
export class DbClientService {
  constructor(@Inject(DB_CLIENT) private readonly client: Client) {
    this.initConnectTimer();
  }

  public queryAll<T>(query: string, args: any[] = []): Observable<T[]> {
    return from(this.client.query(query, args)).pipe(map((result) => result.rows as T[]));
  }

  public queryOne<T>(query: string, args: any[] = []): Observable<T> {
    return this.queryAll<T>(query, args).pipe(map((records) => (records ? records[0] : null)));
  }

  public justQuery(query: string, args: any[] = []): Observable<void> {
    return from(this.client.query(query, args)).pipe(mapTo(null));
  }

  private initConnectTimer(): void {
    defer(() => this.client.connect())
      .pipe(
        switchMapTo(interval(60000)),
        switchMap(() => this.client.query('SELECT 1')),
        retryWhen((err) => {
          console.error(err);
          return timer(5000);
        }),
      )
      .subscribe();
  }
}
