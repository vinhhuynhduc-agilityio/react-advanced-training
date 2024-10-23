export interface RowData {
  id: string;
  fullName: string;
  earnings: string;
  email: string;
  avatarUrl: string;
  registered: string;
  lastUpdated: string;
};

export interface TaskData {
  id: string;
  userId: string;
  projectId: string;
  taskName: string;
  startDate: string;
  completedDate: string;
  currency: number;
  status: boolean;
  projectName: string;
  fullName: string;
}

export interface UserListDrawerProps {
  users: RowData[];
};

export interface TaskDataProps {
  tasks: TaskData[];
};
