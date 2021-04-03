import { Module } from '@nestjs/common';
import { TaskTypesController } from './task-types.controller';
import {TaskTypesModule} from '../../services/task-types/task-types.module';

@Module({
  controllers: [TaskTypesController],
  imports: [TaskTypesModule],
})
export class TaskTypesApiModule {}
