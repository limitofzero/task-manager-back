import { Module } from '@nestjs/common';

import { DbModule } from '../db/db.module';
import { TaskStatusController } from './task-status.controller';
import { TaskStatusService } from './task-status.service';

@Module({
  imports: [DbModule],
  controllers: [TaskStatusController],
  providers: [TaskStatusService],
})
export class TaskStatusModule {}
