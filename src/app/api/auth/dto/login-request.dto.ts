import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginRequestDto {
  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  public password: string;

  public rememberMe: boolean;
}
