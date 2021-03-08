import { Inject, Injectable } from '@nestjs/common';
import { Client } from 'pg';

import { AddUserDto } from '../../api/projects/dto/add-user.dto';
import { DB_CLIENT } from '../../db/db.module';
import { User } from '../user/user.interface';
import { Project } from './project';
import { ShortProjectInfo } from './short-project-info';

@Injectable()
export class ProjectsService {
  constructor(@Inject(DB_CLIENT) private readonly client: Client) {}

  public async getProjects(): Promise<Project[]> {
    return this.client
      .query(`SELECT * FROM projects`)
      .then((result) => result.rows);
  }

  public async getShortProjectInfo(
    projectId: string,
  ): Promise<ShortProjectInfo> {
    return this.client
      .query(
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
      )
      .then((result) => result.rows?.[0]);
  }

  public async findOneBy(params: Record<string, any>): Promise<Project> {
    const select = `SELECT * FROM projects WHERE`;
    const conditions = this.constructConditions(params);
    console.log('REQ: ', `${select} ${conditions}`);
    return this.client
      .query(`${select} ${conditions}`)
      .then((result) => result?.rows?.[0]);
  }

  public async createProject(project: { name: string }): Promise<Project> {
    return this.client
      .query(
        `
        INSERT INTO projects (name) VALUES ('${project.name}') RETURNING *
    `,
      )
      .then((result) => result.rows?.[0]);
  }

  public async getProjectUsers(id: string): Promise<User[]> {
    return this.client
      .query(
        `
        SELECT users.id, users.username, users.email FROM users JOIN projects_users 
        ON projects_users.project_id = $1 AND projects_users.user_id = users.id
      `,
        [id],
      )
      .then((result) => result?.rows);
  }

  public async addUser(addUser: AddUserDto): Promise<void> {
    return this.client
      .query(
        `INSERT INTO projects_users (user_id, project_id) VALUES ('${addUser.userId}' ,'${addUser.projectId}')`,
      )
      .then(() => null);
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
