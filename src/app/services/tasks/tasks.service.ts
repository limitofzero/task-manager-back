import { Inject, Injectable } from '@nestjs/common';
import { DB_CLIENT } from '../../db/db.module';
import { Client } from 'pg';
import { Task } from './task';

@Injectable()
export class TasksService {
  constructor(@Inject(DB_CLIENT) private readonly client: Client) {}

  public async getAll(): Promise<Task[]> {
    return this.client
      .query(
        `
      SELECT tasks.id, tasks.status_id AS status, tasks.creator_id, tasks.performer_id,
       tasks.title, tasks.description, tasks.project_id, task_statuses.description AS status FROM tasks
           JOIN task_statuses ON tasks.status_id = task_statuses.id;
    `,
      )
      .then((result) => result?.rows);
  }
}
