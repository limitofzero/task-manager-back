import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

import { DbClientService } from '../db/db-client/db-client.service';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';
import { User } from './user.interface';

@Injectable()
export class UserService {
  constructor(private readonly client: DbClientService) {}

  public getAll(filter: GetUsersFilterDto): Observable<User[]> {
    if (filter) {
      return this.getUsersByProjectId(filter.projectId);
    }

    return this.client.queryAll<User>('SELECT * FROM users');
  }

  private getUsersByProjectId(projectId: string): Observable<User[]> {
    return this.client.queryAll<User>(
      `
        SELECT u.id, u.username, u.email FROM users as u JOIN projects_users ON u.id = projects_users.user_id AND projects_users.project_id = $1
      `,
      [projectId],
    );
  }

  public getUserByEmail(email: string): Observable<User> {
    return this.client.queryOne<User>(
      `SELECT u.id, u.username, u.email, u.password FROM users as u WHERE email = $1`,
      [email],
    );
  }

  public getUserById(id: string): Observable<User> {
    return this.client.queryOne<User>(
      `SELECT u.id, u.username, u.email FROM users as u WHERE u.id = $1`,
      [id],
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
}
