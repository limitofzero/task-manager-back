import { Injectable } from '@nestjs/common';
import {DbClientService} from '../../db/db-client/db-client.service';
import {Observable} from 'rxjs';
import {TaskType} from './task-type';

@Injectable()
export class TaskTypesService {
    constructor(private readonly dbClient: DbClientService) {
    }

    public getAll(): Observable<TaskType[]> {
        return this.dbClient.queryAll<TaskType>(
            `SELECT * FROM task_types`
        );
    }
}
