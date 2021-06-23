import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

import { DbClientService } from '../db/db-client/db-client.service';
import { TaskType } from './task-type';

@Injectable()
export class TaskTypeService {
  constructor(private readonly dbClient: DbClientService) {}

  public getAll(): Observable<TaskType[]> {
    return this.dbClient.queryAll<TaskType>(`SELECT * FROM task_types`);
  }
}
