import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { Observable } from 'rxjs';

import { LoginRequestDto } from './dto/login-request.dto';
import { RegisterRequestDto } from './dto/register-request.dto';
import { LoginService } from './login.service';
import { RegisterService } from './register.service';

@Controller()
export class AuthController {
  constructor(
    private readonly loginService: LoginService,
    private readonly registerService: RegisterService,
  ) {}

  @Post('login')
  public login(
    @Body() loginRequest: LoginRequestDto,
  ): Observable<{ token: string } | HttpException> {
    return this.loginService.authorize(loginRequest);
  }

  @Post('register')
  public register(@Body() registerRequest: RegisterRequestDto): Observable<void> {
    return this.registerService.createUserAndSendConfirmationEmail(registerRequest);
  }
}
