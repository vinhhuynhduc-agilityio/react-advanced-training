import {
  ColDef,
  GetRowIdParams,
  GridReadyEvent,
  RowClassParams,
  RowClickedEvent
} from "ag-grid-community";

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
};

export interface ProjectsData {
  id: string;
  projectName: string;
};

export interface DataGridProps<T> {
  rowData: T[];
  columnDefs: ColDef<T>[];
  onRowClicked?: (event: RowClickedEvent) => void;
  getRowClass?: (params: RowClassParams) => string;
  rowHeight?: number;
  onGridReady: (event: GridReadyEvent) => void;
  getRowId: (params: GetRowIdParams<T>) => string
};

export interface UserListDrawerProps {
  users: RowData[];
  selectedUserId: string | null;
  onUserSelected: (userId: string | null) => void;
};

export interface TaskDataProps {
  tasks: TaskData[];
  selectedUserId: string | null;
  onTaskRowSelected: (userId: string | null) => void;
  projects: ProjectsData[];
};
