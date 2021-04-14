import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateTaskStatusDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  public name: string;
}
