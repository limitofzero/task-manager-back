import { Inject, Injectable } from '@nestjs/common';
import { Client } from 'pg';
import { Observable, from } from 'rxjs';
import { map, mapTo } from 'rxjs/operators';
import { DB_CLIENT } from './db-client.token';

@Injectable()
export class DbClientService {
  constructor(@Inject(DB_CLIENT) private readonly client: Client) {
    this.client.connect();
  }

  public queryAll<T>(query: string, args: any[] = []): Observable<T[]> {
    return from(this.client.query(query, args)).pipe(
      map((result) => result.rows as T[]),
    );
  }

  public queryOne<T>(query: string, args: any[] = []): Observable<T> {
    return this.queryAll<T>(query, args).pipe(
      map((records) => (records ? records[0] : null)),
    );
  }

  public justQuery(query: string, args: any[] = []): Observable<void> {
    return from(this.client.query(query, args)).pipe(mapTo(null));
  }
}
