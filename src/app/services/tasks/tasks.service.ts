import { Inject, Injectable } from '@nestjs/common';
import { Client } from 'pg';

import { DB_CLIENT } from '../../db/db.module';
import { Task } from './task';

@Injectable()
export class TasksService {
  private readonly BASE_REQ = `
      SELECT tasks.id, tasks.status_id AS status, tasks.creator_id, tasks.performer_id,
       tasks.title, tasks.description, tasks.project_id, task_statuses.description AS status FROM tasks
           JOIN task_statuses ON tasks.status_id = task_statuses.id
    `;

  constructor(@Inject(DB_CLIENT) private readonly client: Client) {}

  public async getAll(): Promise<Task[]> {
    return this.client
      .query(`${this.BASE_REQ};`)
      .then((result) => result?.rows);
  }

  public async getTasksByPerformerId(id: string): Promise<Task[]> {
    return this.client
      .query(`${this.BASE_REQ} WHERE performer_id = $1;`, [id])
      .then((result) => result?.rows);
  }

  public async getTasksByCreatorId(id: string): Promise<Task[]> {
    return this.client
      .query(`${this.BASE_REQ} WHERE creator_id = $1;`, [id])
      .then((result) => result?.rows);
  }

  public async getTasksByProjectId(id: string): Promise<Task[]> {
    return this.client
      .query(`${this.BASE_REQ} WHERE project_id = $1;`, [id])
      .then((result) => result?.rows);
  }

  public async createTask(createTaskDto: any): Promise<Task> {
    const {
      creatorId,
      performerId,
      statusId,
      title,
      description,
      projectId,
    } = createTaskDto;

    await this.client.query(
      `
        INSERT INTO tasks
        (creator_id, performer_id, status_id, title, description, project_id)
        VALUES($1, $2, $3, $4, $5, $6)`,
      [creatorId, performerId, statusId, title, description, projectId],
    );

    return this.client
      .query(
        `${this.BASE_REQ} WHERE creator_id = $1 AND title = $2 AND project_id = $3`,
        [creatorId, title, projectId],
      )
      .then((result) => result?.rows?.[0]);
  }
}
