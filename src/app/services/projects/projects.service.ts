import { Inject, Injectable } from '@nestjs/common';
import { Client } from 'pg';

import { AddUserDto } from '../../api/projects/dto/add-user.dto';
import { DB_CLIENT } from '../../db/db.module';
import { Project } from './project';

@Injectable()
export class ProjectsService {
  constructor(@Inject(DB_CLIENT) private readonly client: Client) {}

  public async getProjects(): Promise<Project[]> {
    return this.client
      .query(`SELECT * FROM projects`)
      .then((result) => result.rows);
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
