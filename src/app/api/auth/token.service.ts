import { Injectable } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';
import { Observable, of, throwError } from 'rxjs';

export interface JWTOptions {
  expiresIn: string | number;
}

@Injectable()
export class TokenService {
  public createJWT<T extends Record<string, unknown>>(
    payload: T,
    options: JWTOptions,
  ): Observable<string> {
    const secret = process.env.SECRET ?? '';
    const { expiresIn } = options;

    return of(sign(payload, secret, { expiresIn }));
  }

  public verifyJWT<T>(token: string): Observable<T> {
    let payload: T = null;

    try {
      payload = (verify(token, process.env.SECRET) as unknown) as T;
    } catch (e) {
      return throwError(e);
    }

    return of(payload);
  }
}
