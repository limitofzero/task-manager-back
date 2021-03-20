import { Controller, Get, Param } from '@nestjs/common';
import { Observable } from 'rxjs';

import { Project } from '../../services/projects/project';
import { User } from '../../services/user/user.interface';
import { UserService } from '../../services/user/user.service';

@Controller('users')
export class UserController {
  constructor(protected readonly user: UserService) {}

  @Get()
  public getUsers(): Observable<User[]> {
    return this.user.getAll();
  }

  @Get(':id/projects')
  public getUserProjects(
    @Param() params: { id: string },
  ): Observable<Project[]> {
    return this.user.getUserProjects(params.id);
  }
}
