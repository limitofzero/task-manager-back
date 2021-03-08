import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { Project } from '../../services/projects/project';
import { ProjectsService } from '../../services/projects/projects.service';
import { User } from '../../services/user/user.interface';
import { AddUserDto } from './dto/add-user.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { ShortProjectInfo } from '../../services/projects/short-project-info';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projects: ProjectsService) {}

  @Get()
  public getProjects(): Promise<Project[]> {
    return this.projects.getProjects();
  }

  @Get('short-info/:id')
  public getShortProjectInfo(@Param() params: { id: string }): Promise<ShortProjectInfo> {
    return this.projects.getShortProjectInfo(params.id);
  }

  @Get('users/:id')
  public getProjectUsers(@Param() params: { id: string }): Promise<User[]> {
    return this.projects.getProjectUsers(params.id);
  }

  @Get(':id')
  public getProjectById(@Param() params: { id: string }): Promise<Project> {
    return this.projects.findOneBy({ id: params.id });
  }

  @Post('create')
  public createProject(@Body() project: CreateProjectDto): Promise<Project> {
    return this.projects.createProject(project);
  }

  @Post('add-user')
  public addUser(@Body() user: AddUserDto): Promise<void> {
    return this.projects.addUser(user);
  }
}
