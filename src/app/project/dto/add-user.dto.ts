import { IsNotEmpty, IsUUID } from 'class-validator';

export class AddUserDto {
  @IsNotEmpty()
  @IsUUID()
  public projectId: string;

  @IsNotEmpty()
  @IsUUID()
  public userId: string;
}
