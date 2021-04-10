import { Injectable } from '@nestjs/common';
import { Observable, of, throwError } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { CreateTaskDto } from '../../api/tasks/dto/create-task.dto';
import { DbClientService } from '../../db/db-client/db-client.service';
import { Task } from './task';

@Injectable()
export class TasksService {
  private readonly BASE_REQ = `
      SELECT tasks.id, tasks.status_id AS status, tasks.creator_id, tasks.performer_id,
       tasks.title, tasks.description, tasks.project_id, tasks.type_id, task_statuses.name AS status FROM tasks
           JOIN task_statuses ON tasks.status_id = task_statuses.id
    `;

  constructor(private readonly client: DbClientService) {}

  public getAll(): Observable<Task[]> {
    return this.client.queryAll<Task>(`${this.BASE_REQ};`);
  }

  public getTasksByPerformerId(id: string): Observable<Task[]> {
    return this.client.queryAll<Task>(
      `${this.BASE_REQ} WHERE performer_id = $1;`,
      [id],
    );
  }

  public getTasksByCreatorId(id: string): Observable<Task[]> {
    return this.client.queryAll<Task>(
      `${this.BASE_REQ} WHERE creator_id = $1;`,
      [id],
    );
  }

  public getTasksByProjectId(id: string): Observable<Task[]> {
    return this.client.queryAll(`${this.BASE_REQ} WHERE project_id = $1;`, [
      id,
    ]);
  }

  public createTask(createTaskDto: CreateTaskDto): Observable<Task> {
    const {
      creatorId,
      performerId,
      statusId,
      title,
      description,
      projectId,
      taskId,
    } = createTaskDto;

    return this.isUserHasInProject(creatorId, projectId).pipe(
      mergeMap((isCreatorInProject) => {
        return isCreatorInProject
          ? of(true)
          : throwError(`Project hasn't user ${creatorId}`);
      }),
      mergeMap(() => {
        return performerId
          ? this.isUserHasInProject(performerId, projectId)
          : of(true);
      }),
      mergeMap((isPerformerInProject) => {
        return isPerformerInProject
          ? of(true)
          : throwError(`Project hasn't user ${projectId}`);
      }),
      mergeMap(() =>
        this.client.queryOne<Task>(
          `
        INSERT INTO tasks
        (creator_id, performer_id, status_id, title, description, project_id, type_id)
        VALUES($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`,
          [creatorId, performerId, statusId, title, description, projectId, taskId],
        ),
      ),
    );
  }

  public assignUser(
    taskId: string,
    userId: string,
    projectId: string,
  ): Observable<Task> {
    return this.isUserHasInProject(userId, projectId).pipe(
      mergeMap((isUserHasInProject) => {
        if (isUserHasInProject) {
          return this.client.queryOne<Task>(
            `
      UPDATE tasks SET performer_id = $1 WHERE id = $2 RETURNING *;
    `,
            [userId, taskId],
          );
        }

        return throwError(`Project hasn't user ${projectId}`);
      }),
    );
  }

  private isUserHasInProject(
    userId: string,
    projectId: string,
  ): Observable<boolean> {
    return this.client
      .queryOne(
        `
        SELECT pu.user_id FROM projects_users as pu WHERE pu.user_id = $1 AND pu.project_id = $2;
      `,
        [userId, projectId],
      )
      .pipe(map(Boolean));
  }
}
