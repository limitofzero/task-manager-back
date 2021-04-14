import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Task } from '../../services/tasks/task';
import { TasksService } from '../../services/tasks/tasks.service';
import { AssignUserDto } from './dto/assign-user.dto';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(public readonly tasks: TasksService) {}

  @Get()
  public getAll(): Observable<Task[]> {
    return this.tasks.getAll();
  }

  @Post()
  public createTask(@Body() createTaskDto: CreateTaskDto): Observable<Task> {
    return this.tasks
        .createTask(createTaskDto)
        .pipe(catchError((e) => throwError(new BadRequestException(e.message))));
  }

  @Get('performer/:id')
  public getByPerformerId(@Param() params: { id: string }): Observable<Task[]> {
    return this.tasks.getTasksByPerformerId(params.id);
  }

  @Get('creator/:id')
  public getByCreatorId(@Param() params: { id: string }): Observable<Task[]> {
    return this.tasks.getTasksByCreatorId(params.id);
  }

  @Get('projects/:id')
  public getByProjectId(@Param() params: { id: string }): Observable<Task[]> {
    return this.tasks.getTasksByProjectId(params.id);
  }

  @Post('assign-user')
  public assignUser(@Body() assignUserDto: AssignUserDto): Observable<Task> {
    const { userId, taskId, projectId } = assignUserDto;

    return this.tasks
      .assignUser(taskId, userId, projectId)
      .pipe(catchError((e) => throwError(new BadRequestException(e.message))));
  }
}
