import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksModule } from '../../services/tasks/tasks.module';

@Module({
  imports: [TasksModule],
  controllers: [TasksController],
})
export class TasksApiModule {}
