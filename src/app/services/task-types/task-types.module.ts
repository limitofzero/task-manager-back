import { Module } from '@nestjs/common';
import { TaskTypesService } from './task-types.service';
import {DbModule} from '../../db/db.module';

@Module({
  imports: [DbModule],
  providers: [TaskTypesService],
  exports: [TaskTypesService],
})
export class TaskTypesModule {}
