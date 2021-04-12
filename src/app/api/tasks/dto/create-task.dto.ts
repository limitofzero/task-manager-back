import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsUUID()
  public creatorId: string;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  public typeId: number;

  @IsOptional()
  @IsNotEmpty()
  @IsUUID()
  public performerId?: string;

  @IsNotEmpty()
  @IsUUID()
  public projectId: string;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  public statusId: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  public title: string;

  @IsString()
  public description: string;
}
