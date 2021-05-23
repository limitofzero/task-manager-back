import {IsNotEmpty, IsUUID} from 'class-validator';

export class GetTasksFilterDto {
    @IsNotEmpty()
    @IsUUID()
    public performerId?: string;
}
