import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { Project } from '../../services/projects/project';
import { ProjectsService } from '../../services/projects/projects.service';
import { CreateProjectDto } from './dto/create-project.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projects: ProjectsService) {}

  @Get()
  public getProjects(): Promise<Project[]> {
    return this.projects.getProjects();
  }

  @Get(':id')
  public getProjectById(@Param() params: { id: string }): Promise<Project> {
    return this.projects.findOneBy({ id: params.id });
  }

  @Post('create')
  public createProject(@Body() project: CreateProjectDto): Promise<Project> {
    return this.projects.createProject(project);
  }
}
