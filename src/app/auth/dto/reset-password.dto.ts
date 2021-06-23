import { IsNotEmpty } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty()
  newPassword: string;

  @IsNotEmpty()
  repeatNewPassword: string;

  @IsNotEmpty()
  token: string;
}
