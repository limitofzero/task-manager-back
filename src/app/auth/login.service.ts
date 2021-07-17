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
        user && user.password === password
          ? this.returnToken(user.id, rememberMe).pipe(map((token) => ({ token })))
          : throwError(new BadRequestException("User with this email/password doesn't exist")),
      ),
    );
  }

  private returnToken(userId: string, rememberMe: boolean): Observable<string> {
    const expiresIn = this.getExpiresIn(rememberMe);

    return this.token.createJWT(
      { id: userId },
      {
        expiresIn,
      },
    );
  }

  private getExpiresIn(rememberMe: boolean): string {
    return rememberMe ? '30d' : '1h';
  }
}
