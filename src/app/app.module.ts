import { Module } from '@nestjs/common';

import { AuthApiModule } from './api/auth/auth-api.module';
import { ProjectsApiModule } from './api/projects/projects-api.module';
import { UserApiModule } from './api/user/user-api.module';
import { DbModule } from './db/db.module';

@Module({
  imports: [
    AuthApiModule,
    UserApiModule,
    ProjectsApiModule,
    DbModule.forRoot(),
  ],
})
export class AppModule {}
