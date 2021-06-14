import { Controller, Get, Query } from '@nestjs/common';
import { Observable } from 'rxjs';

import { GetUsersFilterDto } from './dto/get-users-filter.dto';
import { User } from './user.interface';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(protected readonly user: UserService) {}

  @Get()
  public getUsers(@Query() params: GetUsersFilterDto): Observable<User[]> {
    return this.user.getAll(params);
  }
}
