import { IsNotEmpty, IsUUID } from 'class-validator';

export class AssignUserDto {
  @IsNotEmpty()
  @IsUUID()
  public taskId: string;

  @IsNotEmpty()
  @IsUUID()
  public projectId: string;

  @IsNotEmpty()
  @IsUUID()
  public userId: string;
}
