export interface UserData {
  id: string;
  fullName: string;
  earnings: string;
  email: string;
  avatarUrl: string;
  registered: string;
  lastUpdated: string;
}

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
  tooltipShowDelay?: number;
}

export interface ProjectsData {
  id: string;
  projectName: string;
}

export type StatusWithDate = {
  status: boolean;
  completedDate: string;
};

export type FieldValue =
  | string
  | number
  | boolean
  | ProjectsData
  | UserData
  | StatusWithDate;
