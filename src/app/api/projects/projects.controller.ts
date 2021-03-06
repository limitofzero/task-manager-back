import { Body, Controller, Get, Post } from '@nestjs/common';

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

  @Post('create')
  public createProject(@Body() project: CreateProjectDto): Promise<Project> {
    return this.projects.createProject(project);
  }
}
