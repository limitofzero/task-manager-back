import { Controller, Get } from '@nestjs/common';
import { Observable } from 'rxjs';

import { TaskType } from './task-type';
import { TaskTypeService } from './task-type.service';

@Controller('task-types')
export class TaskTypeController {
  constructor(private readonly taskTypes: TaskTypeService) {}

  @Get()
  public getAll(): Observable<TaskType[]> {
    return this.taskTypes.getAll();
  }
}
