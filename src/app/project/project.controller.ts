import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { Observable } from 'rxjs';

import { User } from '../user/user.interface';
import { AddUserDto } from './dto/add-user.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { GetProjectDto } from './dto/get-project.dto';
import { GetProjectsFiltersDto } from './dto/get-projects-filters.dto';
import { Project } from './project';
import { ProjectService } from './project.service';
import { ShortProjectInfo } from './short-project-info';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projects: ProjectService) {}

  @Get()
  public getProjects(@Query() params: GetProjectsFiltersDto): Observable<Project[]> {
    return this.projects.getProjects(params);
  }

  @Post()
  public createProject(@Body() project: CreateProjectDto): Observable<Project> {
    return this.projects.createProject(project);
  }

  @Get(':id')
  public getProjectById(@Param() params: GetProjectDto): Observable<Project> {
    return this.projects.findOneBy({ id: params.id });
  }

  @Get('short-info/:id')
  public getShortProjectInfo(@Param() params: { id: string }): Observable<ShortProjectInfo> {
    return this.projects.getShortProjectInfo(params.id);
  }

  @Get('users/:id')
  public getProjectUsers(@Param() params: { id: string }): Observable<User[]> {
    return this.projects.getProjectUsers(params.id);
  }

  @Post('add-user')
  public addUser(@Body() user: AddUserDto): Observable<void> {
    return this.projects.addUser(user);
  }
}
