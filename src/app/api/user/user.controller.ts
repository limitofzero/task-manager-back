import { Controller, Get } from '@nestjs/common';

import { User } from '../../services/user/user.interface';
import { UserService } from '../../services/user/user.service';

@Controller('users')
export class UserController {
  constructor(protected readonly user: UserService) {}

  @Get()
  public async getUsers(): Promise<User[]> {
    return this.user.getAll();
  }
}
