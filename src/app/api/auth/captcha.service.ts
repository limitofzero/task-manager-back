import { HttpService, Injectable } from '@nestjs/common';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

export interface CaptchaResponse {
  success: boolean;
  challenge_ts: string;
  hostname: string;
  'error-codes': string[];
}

@Injectable()
export class CaptchaService {
  private readonly secret = process.env.CAPTCHA_SECRET_KEY;
  private readonly captchaApi = process.env.CAPTCHA_API;

  constructor(private readonly http: HttpService) {}

  public validateCaptcha(response: string): Observable<boolean> {
    return of(true); // todo
    const request = `${this.captchaApi}?response=${response}&secret=${this.secret}`;

    return this.http.post<CaptchaResponse>(request).pipe(
      mergeMap((response) => {
        if (response.status === 200) {
          const data = response.data;

          if (response.data.success) {
            return of(true);
          } else {
            // todo handle errors
            return throwError({ message: data['error-codes'][0] });
          }
        }

        return throwError({ message: response.statusText });
      }),
    );
  }
}
