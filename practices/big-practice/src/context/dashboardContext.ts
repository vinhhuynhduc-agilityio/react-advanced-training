import { createContext } from 'react';

import {
  ProjectsData,
  TaskData,
  UserData
} from '@/types';

interface DashboardContextType {
  users: UserData[];
  tasks: TaskData[];
  projects: ProjectsData[];
  setUsers: React.Dispatch<React.SetStateAction<UserData[]>>;
  setTasks: React.Dispatch<React.SetStateAction<TaskData[]>>;
  setProjects: React.Dispatch<React.SetStateAction<ProjectsData[]>>;
}

export const DashboardContext = createContext<DashboardContextType | null>(null);
