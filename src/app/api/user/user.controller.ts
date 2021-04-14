import {Controller, Get, Query} from '@nestjs/common';
import { Observable } from 'rxjs';

import { User } from '../../services/user/user.interface';
import { UserService } from '../../services/user/user.service';
import {GetUsersFilterDto} from './dto/get-users-filter.dto';

@Controller('users')
export class UserController {
  constructor(protected readonly user: UserService) {}

  @Get()
  public getUsers(
      @Query() params: GetUsersFilterDto
  ): Observable<User[]> {
    return this.user.getAll(params);
  }
}
