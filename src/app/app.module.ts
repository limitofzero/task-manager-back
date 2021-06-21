import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { DbModule } from './db/db.module';
import { ProjectModule } from './project/project.module';
import { TaskStatusModule } from './task-status/task-status.module';
import { TaskTypeModule } from './task-type/task-type.module';
import { TaskModule } from './task/task.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    TaskModule,
    TaskStatusModule,
    DbModule,
    ProjectModule,
    TaskTypeModule,
  ],g
})
export class AppModule {}
