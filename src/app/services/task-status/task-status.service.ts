import { Inject, Injectable } from '@nestjs/common';
import { Client } from 'pg';

import { DB_CLIENT } from '../../db/db.module';
import { TaskStatus } from './task-status';

@Injectable()
export class TaskStatusService {
  constructor(@Inject(DB_CLIENT) private readonly client: Client) {}

  public async getTaskStatuses(): Promise<TaskStatus[]> {
    return this.client
      .query(`SELECT * FROM task_statuses`)
      .then((result) => result?.rows);
  }

  public async addStatus(description: string): Promise<TaskStatus> {
    return this.client
      .query(
        `INSERT INTO task_statuses (description) VALUES ('${description}')`,
      )
      .then(() =>
        this.client.query(
          `SELECT * FROM task_statuses WHERE description = '${description}'`,
        ),
      )
      .then((result) => result?.rows?.[0]);
  }
}
