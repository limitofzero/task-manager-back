import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { DbModule } from '../../db/db.module';

@Module({
  imports: [DbModule.forFeature()],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
