import { Project } from '../project/project';
import { TaskStatus } from '../task-status/task-status';
import { TaskType } from '../task-type/task-type';
import { User } from '../user/user.interface';

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
