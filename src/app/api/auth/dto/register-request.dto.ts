import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class RegisterRequestDto {
  @IsNotEmpty()
  public username: string;

  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  @MinLength(8, {
    message: 'Password is too short',
  })
  @MaxLength(20)
  public password: string;

  public recaptcha: string;
}
