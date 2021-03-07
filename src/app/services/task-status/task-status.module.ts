import { Module } from '@nestjs/common';

import { DbModule } from '../../db/db.module';
import { TaskStatusService } from './task-status.service';

@Module({
  imports: [DbModule.forFeature()],
  providers: [TaskStatusService],
  exports: [TaskStatusService],
})
export class TaskStatusModule {}
