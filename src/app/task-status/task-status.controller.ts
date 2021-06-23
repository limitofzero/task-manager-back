import { Body, Controller, Get, Post } from '@nestjs/common';
import { Observable } from 'rxjs';

import { CreateTaskStatusDto } from './dto/create-task-status.dto';
import { TaskStatus } from './task-status';
import { TaskStatusService } from './task-status.service';

@Controller('task-statuses')
export class TaskStatusController {
  constructor(private readonly taskStatus: TaskStatusService) {}

  @Get()
  public getAll(): Observable<TaskStatus[]> {
    return this.taskStatus.getTaskStatuses();
  }

  @Post('create')
  public addStatus(@Body() status: CreateTaskStatusDto): Observable<TaskStatus> {
    return this.taskStatus.addStatus(status.name);
  }
}
