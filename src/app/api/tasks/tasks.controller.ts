import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';

import { Task } from '../../services/tasks/task';
import { TasksService } from '../../services/tasks/tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(public readonly tasks: TasksService) {}

  @Get()
  public async getAll(): Promise<Task[]> {
    return this.tasks.getAll();
  }

  @Get('performer/:id')
  public async getByPerformerId(
    @Param() params: { id: string },
  ): Promise<Task[]> {
    return this.tasks.getTasksByPerformerId(params.id);
  }

  @Get('creator/:id')
  public async getByCreatorId(
    @Param() params: { id: string },
  ): Promise<Task[]> {
    return this.tasks.getTasksByCreatorId(params.id);
  }

  @Get('projects/:id')
  public async getByProjectId(
    @Param() params: { id: string },
  ): Promise<Task[]> {
    return this.tasks.getTasksByProjectId(params.id);
  }

  @Post('create')
  public async create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    try {
      return await this.tasks.createTask(createTaskDto);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
