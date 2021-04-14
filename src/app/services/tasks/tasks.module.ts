import { Module } from '@nestjs/common';

import { DbModule } from '../../db/db.module';
import { TasksService } from './tasks.service';

@Module({
  imports: [DbModule],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
