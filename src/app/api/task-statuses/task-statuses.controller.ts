import { Body, Controller, Get, Post } from '@nestjs/common';

import { TaskStatus } from '../../services/task-status/task-status';
import { TaskStatusService } from '../../services/task-status/task-status.service';
import { CreateTaskStatusDto } from './dto/create-task-status.dto';

@Controller('task-statuses')
export class TaskStatusesController {
  constructor(private readonly taskStatus: TaskStatusService) {}

  @Get()
  public getAll(): Promise<TaskStatus[]> {
    return this.taskStatus.getTaskStatuses();
  }

  @Post('create')
  public addStatus(@Body() status: CreateTaskStatusDto): Promise<TaskStatus> {
    return this.taskStatus.addStatus(status.description);
  }
}
