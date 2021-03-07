import { Controller, Get } from '@nestjs/common';
import { TasksService } from '../../services/tasks/tasks.service';
import { Task } from '../../services/tasks/task';

@Controller('tasks')
export class TasksController {
  constructor(public readonly tasks: TasksService) {
  }

  @Get()
  public async getAll(): Promise<Task[]> {
    return this.tasks.getAll();
  }
}
