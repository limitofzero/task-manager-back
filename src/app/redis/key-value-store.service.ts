import { Inject, Injectable } from '@nestjs/common';
import * as IORedis from 'ioredis';
import { Observable, defer } from 'rxjs';
import { map, mapTo, mergeMap } from 'rxjs/operators';

export const REDIS = Symbol('redis');

const DEFAULT_KEY_EXP_TIME = 1200000;

@Injectable()
export class KeyValueStoreService {
  private readonly defaultExpTime: number;

  constructor(@Inject(REDIS) private readonly redis: IORedis.Redis) {
    const defaultExpTime = process.env.REDIS_DEFAULT_EXP_TIME;
    this.defaultExpTime = defaultExpTime
      ? +defaultExpTime
      : DEFAULT_KEY_EXP_TIME;
  }

  public get<T>(key: string): Observable<T> {
    return defer(() => this.redis.get(key)).pipe(
      map((value) => JSON.parse(value) as T),
    );
  }

  public remove(key: string): Observable<void> {
    return defer(() => this.redis.del(key)).pipe(mapTo(null));
  }

  public getAndRemove<T>(key: string): Observable<T> {
    return this.get<T>(key).pipe(
      mergeMap((value) => this.remove(key).pipe(mapTo(value))),
    );
  }

  public set<T>(key: string, value: T): Observable<void> {
    const valueAsString = JSON.stringify(value);

    return defer(() => this.redis.set(key, valueAsString)).pipe(mapTo(null));
  }

  public setWithExp<T>(
    key: string,
    value: T,
    expTime: number,
  ): Observable<void> {
    const valueAsString = JSON.stringify(value);

    return defer(() => this.redis.set(key, valueAsString, 'EX', expTime)).pipe(
      mapTo(null),
    );
  }
}
