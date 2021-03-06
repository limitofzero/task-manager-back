import { Injectable } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { mapTo, mergeMap } from 'rxjs/operators';

import { MailTransporterService } from '../../mail/mail-transporter.service';
import { KeyValueStoreService } from '../../redis/key-value-store.service';
import { User } from '../../services/user/user.interface';
import { TokenService } from './token.service';

const DEFAULT_PS_EXP_SEC = 1200;

@Injectable()
export class MailService {
  private readonly host = 'http://localhost:4200'; // todo replace by env
  private readonly from = '"limitofzero 👻" <limitofzero2@gmail.com>';

  private id = 0;

  constructor(
    private readonly mail: MailTransporterService,
    private readonly token: TokenService,
    private readonly keyValueStore: KeyValueStoreService,
  ) {}

  public sendResetPasswordEmail(user: User): Observable<void> {
    const email = user.email;
    this.id++;

    const RESET_PS_TOKEN_EXP_SEC = process.env.RESET_PS_TOKEN_EXP_SEC;
    const expiresIn = RESET_PS_TOKEN_EXP_SEC
      ? +RESET_PS_TOKEN_EXP_SEC
      : DEFAULT_PS_EXP_SEC;

    return this.generateToken(user, expiresIn).pipe(
      mergeMap((token) =>
        this.keyValueStore
          .setWithExp(this.id.toString(), token, expiresIn)
          .pipe(mapTo(this.id)),
      ),
      mergeMap((key) =>
        this.mail.sendEmail({
          from: this.from,
          to: email,
          subject: 'Hello ✔',
          text: 'You were registered!!!',
          html: `Reset password link: ${this.host}/auth/reset-password?reset-password-token=${key}`,
        }),
      ),
      mapTo(null),
    );
  }

  public sendVerificationEmail(user: User): Observable<void> {
    return of(null); // todo
    const email = user.email;

    return this.generateToken(user, '24h').pipe(
      mergeMap((token) =>
        this.mail.sendEmail({
          from: this.from,
          to: email,
          subject: 'Hello ✔',
          text: 'You were registered!!!',
          html: `Verification link: ${this.host}/auth/confirm-email?confirm-token=${token}`,
        }),
      ),
    );
  }

  private generateToken(
    user: User,
    expiresIn: string | number,
  ): Observable<string> {
    const { email } = user;

    return this.token.createJWT(
      {
        email,
      },
      {
        expiresIn,
      },
    );
  }
}
