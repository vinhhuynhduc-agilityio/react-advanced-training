import {
  useEffect,
  useRef,
} from "react";

import {
  FieldValue,
  ProjectsData,
  TaskData,
  UserData
} from "@/types/table";

// ag-grid
import {
  CellEditingStartedEvent,
  CellEditingStoppedEvent,
  ColDef,
  GetRowIdParams,
  GridApi,
  GridReadyEvent,
  ICellRendererParams,
  RowClassParams,
  RowClickedEvent
} from "ag-grid-community";

// components
import { IconRenderer } from "@/components/DataGrid/CustomCellRenderer/StatusIcon/StatusIcon";
import { DropdownCellEditor } from "@/components/DataGrid/CustomCellRenderer/DropdownCellEditor/DropdownCellEditor";
import DataGrid from "@/components/DataGrid/DataGrid";

// utils
import { apiRequest } from "@/utils/apiRequest";

// helpers
import {
  getDateColumnSortComparator,
  getUpdatedRow
} from "../helpers/TaskDashboard";

// types
import { FieldType } from "@/types/fieldEnums";

interface TaskDataProps {
  tasks: TaskData[];
  selectedUserId: string | null;
  onTaskRowSelected: (userId: string | null) => void;
  projects: ProjectsData[];
  sourceComponent: string | null;
  users: UserData[];
  updateEarningsForUsers: (oldUserId: string, newUserId: string, currency: number, status: boolean) => void;
  updateEarningsOnStatusChange: (userId: string, currency: number, status: boolean) => void;
  registerGridApiTaskDashboard: (api: GridApi) => void;
  setTasks: React.Dispatch<React.SetStateAction<TaskData[]>>;
};

const TaskDashboard: React.FC<TaskDataProps> = ({
  tasks,
  selectedUserId,
  projects,
  sourceComponent,
  users,
  onTaskRowSelected,
  updateEarningsForUsers,
  updateEarningsOnStatusChange,
  registerGridApiTaskDashboard,
  setTasks
}) => {
  const gridApi = useRef<GridApi | null>(null);
  const tasksRef = useRef(tasks);
  const originalTaskNameRef = useRef<string>('');

  const onGridReady = (params: GridReadyEvent) => {
    gridApi.current = params.api;

    // Pass GridApi to Dashboard via registerGridApi
    registerGridApiTaskDashboard(params.api);
  }

  useEffect(() => {
    tasksRef.current = tasks;
  }, [tasks]);

  //  When `selectedUserId` changes, scroll to the corresponding row
  useEffect(() => {
    if (
      sourceComponent !== "TaskDashboard"
      && selectedUserId
      && gridApi.current
    ) {
      const idTask = tasksRef.current
        .slice()
        .reverse()
        .find(item => item.userId === selectedUserId)?.id;

      if (idTask) {
        const rowNode = gridApi.current.getRowNode(idTask);

        // Scroll to row with matching userId
        if (rowNode) {
          gridApi.current.ensureNodeVisible(rowNode, 'middle');
        }
      }
    }
  }, [selectedUserId, sourceComponent]);

  // Stop editing when browser resizes.
  useEffect(() => {
    const handleResize = () => {
      gridApi.current?.stopEditing();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleSaveSelect = async (
    type: FieldType,
    value: FieldValue,
    row: TaskData
  ) => {
    const updatedRow = getUpdatedRow(type, value, row);

    // Call API to update row in the backend
    await apiRequest<TaskData, TaskData>(
      'PUT',
      `${import.meta.env.VITE_BASE_API_URL}/tasks/${row.id}`,
      updatedRow
    );

    if (gridApi.current) {
      const rowNode = gridApi.current.getRowNode(row.id);

      // Update the row data in the grid
      if (rowNode) {
        rowNode.setData(updatedRow);
      }
    }
  };

  const getCurrentValueByColumn = {
    [FieldType.TASK_NAME]: () => originalTaskNameRef.current,
    [FieldType.PROJECT]: (row: TaskData) => row.projectId,
    [FieldType.USER]: (row: TaskData) => row.userId,
    [FieldType.STATUS]: (row: TaskData) => row.status,
  };

  const getNewValueByColumn = {
    [FieldType.TASK_NAME]: (value: string) => value,
    [FieldType.PROJECT]: (value: ProjectsData) => (value as ProjectsData).id,
    [FieldType.USER]: (value: UserData) => (value as UserData).id,
    [FieldType.STATUS]: (value: boolean) => value,
  };

  const handleValueChange = (type: FieldType) => (
    value: FieldValue,
    row: TaskData
  ) => {
    let currentValue;
    let newValue;
    let customValue;

    switch (type) {
      case FieldType.TASK_NAME:
        currentValue = getCurrentValueByColumn[FieldType.TASK_NAME]();
        newValue = getNewValueByColumn[FieldType.TASK_NAME](value as string);
        customValue = newValue;
        break;

      case FieldType.PROJECT:
        currentValue = getCurrentValueByColumn[FieldType.PROJECT](row);
        newValue = getNewValueByColumn[FieldType.PROJECT](value as ProjectsData);
        customValue = value;

        // Update tasks state in Dashboard
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === row.id
              ? {
                ...task,
                projectId: getNewValueByColumn[FieldType.TASK_NAME](value as string),
                projectName: (value as ProjectsData).projectName,
              }
              : task
          )
        );
        break;

      case FieldType.USER: {
        const {
          userId,
          currency,
          status
        } = row;
        const oldUserId = userId;
        const newUserId = (value as UserData).id;
        currentValue = getCurrentValueByColumn[FieldType.USER](row);
        newValue = getNewValueByColumn[FieldType.USER](value as UserData);
        customValue = value;

        if (oldUserId !== newUserId) {
          updateEarningsForUsers(
            oldUserId,
            newUserId,
            currency,
            status
          );
        }

        // Update tasks state in Dashboard
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === row.id
              ? {
                ...task,
                userId: newUserId,
                fullName: (value as UserData).fullName,
              }
              : task
          )
        );
        break;
      }

      case FieldType.STATUS: {
        const status = value as boolean;
        const currency = row.currency;
        const userId = row.userId;
        const completedDate = status
          ? new Date().toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: '2-digit',
          } as Intl.DateTimeFormatOptions)
          : "incomplete";

        newValue = { status, completedDate };
        customValue = newValue;

        updateEarningsOnStatusChange(userId, currency, status);

        // Update tasks state in Dashboard
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === row.id
              ? {
                ...task,
                status,
                completedDate
              }
              : task
          )
        );
        break;
      }

      default:
        return;
    };

    // If the value hasn't changed, return.
    if (newValue === currentValue) {
      return;
    }

    handleSaveSelect(type, customValue, row);
  };

  const handleRowClicked = (event: RowClickedEvent) => {
    const userId = event.data.userId;

    if (userId) {

      // Pass `userId` to parent component
      onTaskRowSelected(userId);
    }
  };

  const getRowClass = (params: RowClassParams) => {
    return params.data.userId === selectedUserId
      ? 'ag-row-selected'
      : '';
  };

  // Event when editing starts, save the original value
  const handleCellEditingStarted = (event: CellEditingStartedEvent) => {
    const { value, colDef } = event;

    if (colDef.field === FieldType.TASK_NAME) {
      originalTaskNameRef.current = value;
    }
  };

  const handleOnCellEditingStopped = (event: CellEditingStoppedEvent) => {
    const {
      value,
      data,
      colDef
    } = event;

    // Check if the edited column is 'taskName'
    if (colDef.field === FieldType.TASK_NAME) {
      handleValueChange(FieldType.TASK_NAME)(value, data);
    }
  };

  const getRowId = (params: GetRowIdParams<TaskData>) => params.data.id;

  const columnDefs: ColDef<TaskData>[] = [
    {
      headerName: "",
      field: "status",
      cellRenderer: IconRenderer,
      cellRendererParams: (params: ICellRendererParams) => ({
        onStatusValueChange: () => handleValueChange(FieldType.STATUS)(!params.data.status, params.data)
      }),
      width: 55,
      tooltipValueGetter: () => 'Click to complete/uncomplete the task',
      headerClass: "custom-header"
    },
    {
      headerName: "Task",
      field: "taskName",
      editable: true,
      flex: 4.5,
      tooltipValueGetter: () => 'Double-click to edit the task name',
      headerClass: "custom-header"
    },
    {
      headerName: "Project",
      field: "projectName",
      editable: true,
      flex: 3.4,
      cellEditor: DropdownCellEditor,
      cellEditorParams: {
        onSelectOption: handleValueChange(FieldType.PROJECT),
        options: projects,
        displayKey: 'projectName'
      },
      cellEditorPopup: true, // Make sure editor is visible in popup
      tooltipValueGetter: () => 'Double-click to change the project',
      headerClass: "custom-header"
    },
    {
      headerName: "User",
      field: "fullName",
      editable: true,
      flex: 2.4,
      cellEditor: DropdownCellEditor,
      cellEditorParams: {
        onSelectOption: handleValueChange(FieldType.USER),
        options: users,
        displayKey: 'fullName'
      },
      cellEditorPopup: true,
      tooltipValueGetter: () => 'Double-click to assign to a different employee',
      headerClass: "custom-header"
    },
    {
      headerName: "Currency",
      field: "currency",
      flex: 2,
      tooltipValueGetter: () => 'Amount received upon task completion',
      headerClass: "custom-header"
    },
    {
      headerName: "Start",
      field: "startDate",
      flex: 2,
      tooltipValueGetter: () => 'The task was created',
      headerClass: "custom-header",
      comparator: getDateColumnSortComparator
    },
    {
      headerName: "Completed",
      field: "completedDate",
      flex: 2,
      tooltipValueGetter: (params) => {
        return params.data?.status
          ? "The task was completed"
          : "Click on the red clock to complete the task";
      },
      headerClass: "custom-header",
      comparator: getDateColumnSortComparator
    },
  ];

  return (
    <div className="ag-theme-alpine h-full w-full">
      <DataGrid
        rowData={tasks}
        columnDefs={columnDefs}
        onRowClicked={handleRowClicked}
        getRowClass={getRowClass}
        onGridReady={onGridReady}
        getRowId={getRowId}
        onCellEditingStarted={handleCellEditingStarted}
        onCellEditingStopped={handleOnCellEditingStopped}
        tooltipShowDelay={0}
        enableBrowserTooltips={true}
      />
    </div>
  )
};

export default TaskDashboard;
