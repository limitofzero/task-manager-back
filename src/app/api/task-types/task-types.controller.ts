import {Controller, Get} from '@nestjs/common';
import {Observable} from 'rxjs';
import {TaskType} from '../../services/task-types/task-type';
import {TaskTypesService} from '../../services/task-types/task-types.service';

@Controller('task-types')
export class TaskTypesController {
    constructor(
        private readonly taskTypes: TaskTypesService,
    ) {
    }

    @Get()
    public getAll(): Observable<TaskType[]> {
        return this.taskTypes.getAll();
    }
}
