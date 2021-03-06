import { BadRequestException, Injectable } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map, mapTo, mergeMap, tap } from 'rxjs/operators';

import { User } from '../../services/user/user.interface';
import { UserService } from '../../services/user/user.service';
import { CaptchaService } from './captcha.service';
import { RegisterRequestDto } from './dto/register-request.dto';
import { MailService } from './mail.service';
import { TokenService } from './token.service';

@Injectable()
export class RegisterService {
  constructor(
    private readonly userService: UserService,
    private readonly token: TokenService,
    private readonly mail: MailService,
    private readonly captcha: CaptchaService,
  ) {}

  public createUserAndSendConfirmationEmail(
    registerRequest: RegisterRequestDto,
  ): Observable<void> {
    const { email, recaptcha } = registerRequest;

    return this.captcha.validateCaptcha(recaptcha).pipe(
      mergeMap(() => this.userService.getUserByEmail(email)),
      tap(console.log),
      map((user) => (!user ? registerRequest : null)), // todo error
      mergeMap((user) => this.sendEmailAndSaveUser(user)),
      catchError((err: any) => {
        return throwError(new BadRequestException(err));
      }),
    );
  }

  // public confirmUser(token: string): Observable<void> {
  //   return this.token.verifyJWT(token).pipe(
  //     mergeMap(({ email }: { email: string }) => this.userService.findOneBy({ email })),
  //     tap(user => {
  //       if (user) {
  //         user.isConfirmed = true;
  //       }
  //     }),
  //     mergeMap(user => user ? this.userService.save(user) : of(null)),
  //     mapTo(null),
  //     catchError(error => {
  //       throw new BadRequestException(error);
  //     })
  //   );
  // }

  private sendEmailAndSaveUser(user: User | null): Observable<void> {
    return (user
      ? this.mail.sendVerificationEmail(user)
      : throwError(new BadRequestException('User was not created'))
    ).pipe(
      mergeMap(() => this.userService.save(user)),
      mapTo(null),
    );
  }
}
