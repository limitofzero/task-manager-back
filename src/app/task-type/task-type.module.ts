import { Module } from '@nestjs/common';

import { DbModule } from '../db/db.module';
import { TaskTypeController } from './task-type.controller';
import { TaskTypeService } from './task-type.service';

@Module({
  controllers: [TaskTypeController],
  imports: [DbModule],
  providers: [TaskTypeService],
})
export class TaskTypeModule {}
