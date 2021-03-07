import { Controller, Get, Param } from '@nestjs/common';

import { Project } from '../../services/projects/project';
import { User } from '../../services/user/user.interface';
import { UserService } from '../../services/user/user.service';

@Controller('users')
export class UserController {
  constructor(protected readonly user: UserService) {}

  @Get()
  public async getUsers(): Promise<User[]> {
    return this.user.getAll();
  }

  @Get(':id/projects')
  public async getUserProjects(
    @Param() params: { id: string },
  ): Promise<Project[]> {
    return this.user.getUserProjects(params.id);
  }
}
