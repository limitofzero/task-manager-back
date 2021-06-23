import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(20)
  public name: string;
}
