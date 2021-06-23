import { BadRequestException, Injectable } from '@nestjs/common';
import { Observable, from, throwError } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { User } from '../user/user.interface';
import { UserService } from '../user/user.service';
import { LoginRequestDto } from './dto/login-request.dto';
import { TokenService } from './token.service';

@Injectable()
export class LoginService {
  constructor(private readonly userService: UserService, private readonly token: TokenService) {}

  public authorize(loginRequest: LoginRequestDto): Observable<{ token: string }> {
    const { password, email, rememberMe } = loginRequest;

    return from(this.userService.getUserByEmail(email)).pipe(
      mergeMap((user) =>
        user.password === password
          ? this.returnToken(rememberMe)
          : throwError(new BadRequestException("User with this email/password doesn't exist")),
      ),
    );
  }

  private returnToken(rememberMe: boolean): Observable<{ token: string }> {
    const expiresIn = this.getExpiresIn(rememberMe);

    return this.token
      .createJWT(
        {},
        {
          expiresIn,
        },
      )
      .pipe(
        map((token) => ({
          token,
        })),
      );
  }

  private getExpiresIn(rememberMe: boolean): string {
    return rememberMe ? '30d' : '1h';
  }
}
