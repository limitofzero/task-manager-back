import { Module } from '@nestjs/common';

import { TaskStatusModule } from '../../services/task-status/task-status.module';
import { TaskStatusesController } from './task-statuses.controller';

@Module({
  imports: [TaskStatusModule],
  controllers: [TaskStatusesController],
})
export class TaskStatusesApiModule {}
