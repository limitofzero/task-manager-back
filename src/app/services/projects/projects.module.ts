import { Module } from '@nestjs/common';

import { DbModule } from '../../db/db.module';
import { ProjectsService } from './projects.service';

@Module({
  imports: [DbModule],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
