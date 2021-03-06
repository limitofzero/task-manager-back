import { Inject, Injectable } from '@nestjs/common';
import { Client } from 'pg';

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

  public async getProjectByName(name: string): Promise<Project> {
    return this.client
      .query(`SELECT * FROM projects WHERE name = '${name}'`)
      .then((result) => result?.rows?.[0]);
  }

  public async createProject(project: { name: string }): Promise<Project> {
    await this.client.query(`
        INSERT INTO projects (name) VALUES ('${project.name}')
    `);

    return this.getProjectByName(project.name);
  }
}
