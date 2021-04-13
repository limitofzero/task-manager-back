import {TaskStatus} from '../task-status/task-status';
import {Project} from '../projects/project';
import {User} from '../user/user.interface';
import {TaskType} from '../task-types/task-type';

export interface Task {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  project: Project;
  status: TaskStatus;
  creator: User;
  performer?: User;
}
