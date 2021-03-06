import { Inject, Injectable } from '@nestjs/common';
import { Client } from 'pg';

import { DB_CLIENT } from '../../db/db.module';
import { User } from './user.interface';

@Injectable()
export class UserService {
  constructor(@Inject(DB_CLIENT) private readonly client: Client) {
    this.client.connect();
  }

  public async getAll(): Promise<User[]> {
    return this.client
      .query('SELECT * FROM users')
      .then((result) => result.rows);
  }

  public async getUserByEmail(email: string): Promise<User> {
    return this.client
      .query(`SELECT * FROM users WHERE email = '${email}'`)
      .then((result) => result.rows)
      .then((records) => records[0]);
  }

  public async save(user: User): Promise<User> {
    const { email, password, username } = user;
    return this.client
      .query(
        `
        INSERT INTO users (username, email, password)
        VALUES ('${username}', '${email}', '${password}')`,
      )
      .then();
  }
}
