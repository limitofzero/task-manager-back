import { Injectable } from '@nestjs/common';
import { Observable, of, throwError } from 'rxjs';
import {map, mergeMap, switchMap} from 'rxjs/operators';

import { CreateTaskDto } from '../../api/tasks/dto/create-task.dto';
import { DbClientService } from '../../db/db-client/db-client.service';
import { Task } from './task';

interface TaskRow {
  id: string;
  title: string;
  description: string;

  project_id: string;
  project_name: string;

  type_id: number;
  type_name: string;

  status_id: number;
  status_name: string;

  creator_id: string;
  creator_username: string;
  creator_email: string;

  performer_id: string;
  performer_username: string;
  performer_email: string;
}

@Injectable()
export class TasksService {
  private readonly BASE_REQ = `
    SELECT tasks.id,
           tasks.title,
           tasks.description,

           tasks.project_id as project_id,
           projects.name as project_name,

           tasks.type_id AS type_id,
           task_types.name as type_name,

           tasks.status_id AS status_id,
           task_statuses.name AS status_name,

           tasks.creator_id AS creator_id,
           users.username AS creator_username,
           users.email AS creator_email,

           tasks.performer_id AS performer_id,
           users.username AS performer_username,
           users.email AS performer_email FROM tasks
                                                 JOIN task_statuses ON tasks.status_id = task_statuses.id
                                                 JOIN users ON creator_id = users.id OR performer_id = users.id
                                                 JOIN task_types ON type_id = task_types.id
                                                 JOIN projects ON project_id = projects.id
    `;

  constructor(private readonly client: DbClientService) {}

  public getAll(): Observable<Task[]> {
    return this.client.queryAll<TaskRow>(`${this.BASE_REQ};`).pipe(
        map(result => this.transformRows(result)),
    )
  }

  public getTasksByPerformerId(id: string): Observable<Task[]> {
    return this.client.queryAll<TaskRow>(
      `${this.BASE_REQ} WHERE performer_id = $1;`,
      [id],
    ).pipe(
        map(result => this.transformRows(result)),
    );
  }

  public getTasksByCreatorId(id: string): Observable<Task[]> {
    return this.client.queryAll<TaskRow>(
      `${this.BASE_REQ} WHERE creator_id = $1;`,
      [id],
    ).pipe(
        map(result => this.transformRows(result)),
    );
  }

  public getTasksByProjectId(id: string): Observable<Task[]> {
    return this.client.queryAll<TaskRow>(`${this.BASE_REQ} WHERE project_id = $1;`, [
      id,
    ]).pipe(
        map(result => this.transformRows(result)),
    )
  }

  public createTask(createTaskDto: CreateTaskDto): Observable<Task> {
    const {
      creatorId,
      performerId,
      statusId,
      title,
      description,
      projectId,
      typeId,
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
        this.client.queryOne<{ id: number }>(
          `
        INSERT INTO tasks
        (creator_id, performer_id, status_id, title, description, project_id, type_id)
        VALUES($1, $2, $3, $4, $5, $6, $7)
        RETURNING id`,
          [creatorId, performerId, statusId, title, description, projectId, typeId],
        ),
      ),
      mergeMap(({ id }) => this.getTaskById(id)),
    )
  }

  private getTaskById(id: number): Observable<Task> {
    console.log(id)
    return this.client.queryOne<TaskRow>(`${this.BASE_REQ} WHERE tasks.id = $1;`, [id]).pipe(
        map(result => this.transformRow(result)),
    )
  }

  // public assignUser(
  //   taskId: string,
  //   userId: string,
  //   projectId: string,
  // ): Observable<Task> {
  //   return this.isUserHasInProject(userId, projectId).pipe(
  //     mergeMap((isUserHasInProject) => {
  //       if (isUserHasInProject) {
  //         return this.client.queryOne<TaskRow>(
  //           `
  //     UPDATE tasks SET performer_id = $1 WHERE id = $2 RETURNING *;
  //   `,
  //           [userId, taskId],
  //         );
  //       }
  //
  //       return throwError(`Project hasn't user ${projectId}`);
  //     }),
  //   );
  // }

  private transformRows(taskRows: TaskRow[]): Task[] {
    return taskRows.map(row => this.transformRow(row));
  }

  private transformRow(row: TaskRow): Task {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      status: {
        id: row.status_id,
        name: row.status_name,
      },
      project: {
        id: row.project_id,
        name: row.project_name
      },
      type: {
        id: row.type_id,
        name: row.type_name,
      },
      creator: {
        id: row.creator_id,
        email: row.creator_email,
        username: row.creator_username,
      },
      performer: row.performer_id ? {
        id: row.performer_id,
        email: row.performer_email,
        username: row.performer_username,
      } : null,
    };
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
