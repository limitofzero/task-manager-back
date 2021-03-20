import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

import { AddUserDto } from '../../api/projects/dto/add-user.dto';
import { DbClientService } from '../../db/db-client/db-client.service';
import { User } from '../user/user.interface';
import { Project } from './project';
import { ShortProjectInfo } from './short-project-info';

@Injectable()
export class ProjectsService {
  constructor(private readonly client: DbClientService) {}

  public getProjects(): Observable<Project[]> {
    return this.client.queryAll<Project>(`SELECT * FROM projects`);
  }

  public getShortProjectInfo(projectId: string): Observable<ShortProjectInfo> {
    return this.client.queryOne<ShortProjectInfo>(
      `
        SELECT projects.name, projects.id, COUNT(tasks.title) as task_count,
       (SELECT COUNT(projects_users.user_id) as users_count FROM projects_users WHERE project_id = $1),
       (SELECT COUNT(tasks.title) as closed_task_count FROM tasks where tasks.project_id = $1 AND tasks.status_id = 1)
            FROM projects JOIN tasks ON
                projects.id = $1 AND tasks.project_id = projects.id
            JOIN projects_users pu on projects.id = pu.project_id
            GROUP BY projects.name, projects.id;
    `,
      [projectId],
    );
  }

  public findOneBy(params: Record<string, any>): Observable<Project> {
    const select = `SELECT * FROM projects WHERE`;
    const conditions = this.constructConditions(params);

    return this.client.queryOne(`${select} ${conditions}`);
  }

  public createProject(project: { name: string }): Observable<Project> {
    return this.client.queryOne<Project>(
      `
        INSERT INTO projects (name) VALUES ('${project.name}') RETURNING *
    `,
    );
  }

  public getProjectUsers(id: string): Observable<User[]> {
    return this.client.queryAll<User>(
      `
        SELECT users.id, users.username, users.email FROM users JOIN projects_users 
        ON projects_users.project_id = $1 AND projects_users.user_id = users.id
      `,
      [id],
    );
  }

  public addUser(addUser: AddUserDto): Observable<void> {
    return this.client.justQuery(
      `INSERT INTO projects_users (user_id, project_id) VALUES ('${addUser.userId}' ,'${addUser.projectId}')`,
    );
  }

  private constructConditions(params: Record<string, any>): string {
    return Object.keys(params).reduce((acc, key, index) => {
      if (index !== 0) {
        acc += ' AND ';
      }

      const value = params[key];
      acc += `${key} = ${this.getValueForCondition(value)}`;

      return acc;
    }, '');
  }

  private getValueForCondition(value: any): string {
    switch (typeof value) {
      case 'string':
        return `'${value}'`;
      case 'number':
        return value.toString();
      case 'boolean':
        return value ? 'TRUE' : 'FALSE';
    }
  }
}
