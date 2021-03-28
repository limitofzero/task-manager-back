import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Observable } from 'rxjs';

import { Project } from '../../services/projects/project';
import { ProjectsService } from '../../services/projects/projects.service';
import { ShortProjectInfo } from '../../services/projects/short-project-info';
import { User } from '../../services/user/user.interface';
import { AddUserDto } from './dto/add-user.dto';
import { CreateProjectDto } from './dto/create-project.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projects: ProjectsService) {}

  @Get()
  public getProjects(): Observable<Project[]> {
    return this.projects.getProjects();
  }

  @Get('short-info/:id')
  public getShortProjectInfo(
    @Param() params: { id: string },
  ): Observable<ShortProjectInfo> {
    return this.projects.getShortProjectInfo(params.id);
  }

  @Get('users/:id')
  public getProjectUsers(@Param() params: { id: string }): Observable<User[]> {
    return this.projects.getProjectUsers(params.id);
  }

  @Get(':id')
  public getProjectById(@Param() params: { id: string }): Observable<Project> {
    return this.projects.findOneBy({ id: params.id });
  }

  @Post('create')
  public createProject(@Body() project: CreateProjectDto): Observable<Project> {
    return this.projects.createProject(project);
  }

  @Post('add-user')
  public addUser(@Body() user: AddUserDto): Observable<void> {
    return this.projects.addUser(user);
  }

  @Get('by-user/:id')
  public getUserProjects(
      @Param() params: { id: string },
  ): Observable<Project[]> {
    return this.projects.getUserProjects(params.id);
  }
}
