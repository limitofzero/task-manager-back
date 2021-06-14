import { Module } from '@nestjs/common';

import { DbModule } from '../db/db.module';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';

@Module({
  controllers: [ProjectController],
  imports: [DbModule],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
