import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class GetTasksFilterDto {
  @IsOptional()
  @IsNotEmpty()
  @IsUUID()
  public performerId?: string;
}
