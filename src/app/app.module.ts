import { Module } from '@nestjs/common';

import { AuthApiModule } from './api/auth/auth-api.module';
import { ProjectsApiModule } from './api/projects/projects-api.module';
import { TaskStatusesApiModule } from './api/task-statuses/task-statuses-api.module';
import { UserApiModule } from './api/user/user-api.module';
import { DbModule } from './db/db.module';
import { TasksApiModule } from './api/tasks/tasks-api.module';

@Module({
  imports: [
    AuthApiModule,
    UserApiModule,
    TaskStatusesApiModule,
    TasksApiModule,
    ProjectsApiModule,
    DbModule.forRoot(),
  ],
})
export class AppModule {}
