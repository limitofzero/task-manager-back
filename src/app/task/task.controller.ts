import { BadRequestException, Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './task';
import { TaskService } from './task.service';

@Controller('tasks')
export class TaskController {
  constructor(public readonly tasks: TaskService) {}

  @Get()
  public getAll(@Query() params: GetTasksFilterDto): Observable<Task[]> {
    if (params?.performerId) {
      return this.tasks.getTasksByPerformerId(params.performerId);
    }

    return this.tasks.getAll();
  }

  @Post()
  public createTask(@Body() createTaskDto: CreateTaskDto): Observable<Task> {
    return this.tasks
      .createTask(createTaskDto)
      .pipe(catchError((e) => throwError(new BadRequestException(e.message))));
  }

  @Get('creator/:id')
  public getByCreatorId(@Param() params: { id: string }): Observable<Task[]> {
    return this.tasks.getTasksByCreatorId(params.id);
  }

  @Get('projects/:id')
  public getByProjectId(@Param() params: { id: string }): Observable<Task[]> {
    return this.tasks.getTasksByProjectId(params.id);
  }

  // @Post('assign-user')
  // public assignUser(@Body() assignUserDto: AssignUserDto): Observable<Task> {
  //   const { userId, taskId, projectId } = assignUserDto;
  //
  //   return this.tasks
  //     .assignUser(taskId, userId, projectId)
  //     .pipe(catchError((e) => throwError(new BadRequestException(e.message))));
  // }
}
