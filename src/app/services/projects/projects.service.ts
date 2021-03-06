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
}
