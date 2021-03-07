import { Module } from '@nestjs/common';

import { TasksModule } from '../../services/tasks/tasks.module';
import { TasksController } from './tasks.controller';

@Module({
  imports: [TasksModule],
  controllers: [TasksController],
})
export class TasksApiModule {}
