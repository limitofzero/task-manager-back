import { HttpModule, Module } from '@nestjs/common';

import { MailModule } from '../../mail/mail.module';
import { RedisModule } from '../../redis/redis.module';
import { UserModule } from '../../services/user/user.module';
import { AuthController } from './auth.controller';
import { CaptchaService } from './captcha.service';
import { LoginService } from './login.service';
import { MailService } from './mail.service';
import { RegisterService } from './register.service';
import { TokenService } from './token.service';

@Module({
  imports: [RedisModule, UserModule, HttpModule, MailModule],
  providers: [
    LoginService,
    RegisterService,
    CaptchaService,
    MailService,
    TokenService,
  ],
  controllers: [AuthController],
})
export class AuthApiModule {}
