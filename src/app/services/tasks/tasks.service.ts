import { Inject, Injectable } from '@nestjs/common';
import { Client } from 'pg';

import { CreateTaskDto } from '../../api/tasks/dto/create-task.dto';
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

  public async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const {
      creatorId,
      performerId,
      statusId,
      title,
      description,
      projectId,
    } = createTaskDto;

    const isCreatorInProject = await this.isUserHasInProject(
      creatorId,
      projectId,
    );

    if (!isCreatorInProject) {
      throw Error(`Project hasn't user ${creatorId}`);
    }

    const isPerformerInProject =
      !performerId || (await this.isUserHasInProject(performerId, projectId));
    if (!isPerformerInProject) {
      throw Error(`Project hasn't user ${projectId}`);
    }

    return this.client
      .query(
        `
        INSERT INTO tasks
        (creator_id, performer_id, status_id, title, description, project_id)
        VALUES($1, $2, $3, $4, $5, $6)
        RETURNING *`,
        [creatorId, performerId, statusId, title, description, projectId],
      )
      .then((result) => result?.rows?.[0]);
  }

  public async assignUser(
    taskId: string,
    userId: string,
    projectId: string,
  ): Promise<Task> {
    const isUserHasInProject = await this.isUserHasInProject(userId, projectId);

    if (!isUserHasInProject) {
      throw new Error(`Project hasn't user ${projectId}`);
    }

    return this.client
      .query(
        `
      UPDATE tasks SET performer_id = $1 WHERE id = $2 RETURNING *;
    `,
        [userId, taskId],
      )
      .then((result) => result?.rows?.[0]);
  }

  private isUserHasInProject(
    userId: string,
    projectId: string,
  ): Promise<boolean> {
    return this.client
      .query(
        `
        SELECT pu.user_id FROM projects_users as pu WHERE pu.user_id = $1 AND pu.project_id = $2;
      `,
        [userId, projectId],
      )
      .then((result) => result.rows?.[0])
      .then((result) => !!result);
  }
}
