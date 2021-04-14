import {IsNotEmpty, IsOptional, IsUUID} from 'class-validator';

export class GetUsersFilterDto {
    @IsOptional()
    @IsNotEmpty()
    @IsUUID()
    public projectId?: string;
}
