import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

import { DbClientService } from '../../db/db-client/db-client.service';
import { TaskStatus } from './task-status';

@Injectable()
export class TaskStatusService {
  constructor(private readonly client: DbClientService) {}

  public getTaskStatuses(): Observable<TaskStatus[]> {
    return this.client.queryAll<TaskStatus>(`SELECT * FROM task_statuses`);
  }

  public addStatus(name: string): Observable<TaskStatus> {
    return this.client.queryOne<TaskStatus>(
      `INSERT INTO task_statuses (name) VALUES ('${name}') RETURNING *`,
    );
  }
}
