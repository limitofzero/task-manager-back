import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { DbModule } from './db/db.module';
import { TaskStatusModule } from './task-status/task-status.module';
import { TaskModule } from './task/task.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [AuthModule, UserModule, TaskModule, TaskStatusModule, DbModule],
})
export class AppModule {}
