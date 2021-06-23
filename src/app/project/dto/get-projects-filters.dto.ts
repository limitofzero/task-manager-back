import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class GetProjectsFiltersDto {
  @IsOptional()
  @IsNotEmpty()
  @IsUUID()
  public userId?: string;
}
