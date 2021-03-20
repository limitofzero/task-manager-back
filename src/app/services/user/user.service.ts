import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

import { DbClientService } from '../../db/db-client/db-client.service';
import { Project } from '../projects/project';
import { User } from './user.interface';

@Injectable()
export class UserService {
  constructor(private readonly client: DbClientService) {}

  public getAll(): Observable<User[]> {
    return this.client.queryAll<User>('SELECT * FROM users');
  }

  public getUserByEmail(email: string): Observable<User> {
    return this.client.queryOne<User>(
      `SELECT * FROM users WHERE email = '${email}'`,
    );
  }

  public save(user: User): Observable<void> {
    const { email, password, username } = user;
    return this.client.justQuery(
      `
        INSERT INTO users (username, email, password)
        VALUES ('${username}', '${email}', '${password}')`,
    );
  }

  public getUserProjects(id: string): Observable<Project[]> {
    return this.client.queryAll<Project>(
      `
        SELECT projects.id, projects.name FROM projects_users JOIN projects ON projects_users.user_id = '${id}' AND projects.id = projects_users.project_id;
        `,
    );
  }
}
