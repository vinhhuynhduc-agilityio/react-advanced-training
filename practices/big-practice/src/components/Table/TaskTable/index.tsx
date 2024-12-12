import {
  useEffect,
  useRef,
} from 'react';

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
} from 'ag-grid-community';

// components
import {
  DataGrid,
  DropdownCellEditor,
} from '@/components/DataGrid';
import { Spinner } from '@/components/common';
import { CheckMark } from '@/components';

// services
import { apiRequest } from '@/services';

// helpers
import {
  getDateColumnSortComparator,
  getUpdatedRow
} from '@/helpers';

import { API_BASE_URL } from '@/config';

// types
import {
  FieldValue,
  ProjectsData,
  TaskData,
  UserData
} from '@/types';

// constants
import { API_ROUTES, FIELD_TYPE } from '@/constant';

// hooks
import { useDashboardContext } from '@/hooks';

interface TaskDataProps {
  selectedUserId: string | null;
  onTaskRowSelected: (userId: string | null) => void;
  sourceComponent: string | null;
  updateEarningsForUsers: (oldUserId: string, newUserId: string, currency: number, status: boolean) => void;
  updateEarningsOnStatusChange: (userId: string, currency: number, status: boolean) => void;
  registerGridApiTaskDashboard: (api: GridApi) => void;
  isLoading: boolean;
  isSavingTask: boolean;
  isSavingProject: boolean;
  isSavingUser: boolean;
  setSavingTask: (value: boolean) => void;
};

const TaskTable: React.FC<TaskDataProps> = ({
  selectedUserId,
  sourceComponent,
  isLoading,
  isSavingTask,
  isSavingProject,
  isSavingUser,
  onTaskRowSelected,
  updateEarningsForUsers,
  updateEarningsOnStatusChange,
  registerGridApiTaskDashboard,
  setSavingTask
}) => {
  const {
    tasks,
    projects,
    users,
    setTasks
  } = useDashboardContext();
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
      sourceComponent !== 'TaskTable'
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

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleSaveSelect = async (
    type: keyof typeof FIELD_TYPE,
    value: FieldValue,
    row: TaskData
  ) => {
    setSavingTask(true)
    const updatedRow = getUpdatedRow(type, value, row);

    // Call API to update row in the backend
    try {
      await apiRequest<TaskData, TaskData>(
        'PUT',
        `${API_BASE_URL}${API_ROUTES.TASKS}/${row.id}`,
        updatedRow
      );
    } catch (error) {
      console.error('Failed to update task', error);
    } finally {
      setSavingTask(false);
    }

    if (gridApi.current) {
      const rowNode = gridApi.current.getRowNode(row.id);

      // Update the row data in the grid
      if (rowNode) {
        rowNode.setData(updatedRow);
      }
    }
  };

  const handleValueChange = (type: keyof typeof FIELD_TYPE) => (
    value: FieldValue,
    row: TaskData
  ) => {
    let currentValue;
    let newValue;
    let customValue;

    switch (type) {
      case FIELD_TYPE.TASK_NAME:
        currentValue = originalTaskNameRef.current;
        newValue = value;
        customValue = newValue;
        break;

      case FIELD_TYPE.PROJECT:
        currentValue = row.projectId;
        newValue = (value as ProjectsData).id;
        customValue = value;

        // Update tasks state in Dashboard
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === row.id
              ? {
                ...task,
                projectId: (value as ProjectsData).id,
                projectName: (value as ProjectsData).projectName,
              }
              : task
          )
        );
        break;

      case FIELD_TYPE.USER: {
        const {
          userId,
          currency,
          status
        } = row;
        const oldUserId = userId;
        const newUserId = (value as UserData).id;
        currentValue = row.userId;
        newValue = (value as UserData).id;
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

      case FIELD_TYPE.STATUS: {
        const status = value as boolean;
        const currency = row.currency;
        const userId = row.userId;
        const completedDate = status
          ? new Date().toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: '2-digit',
          } as Intl.DateTimeFormatOptions)
          : 'incomplete';

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

    if (colDef.field === FIELD_TYPE.TASK_NAME) {
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
    if (colDef.field === FIELD_TYPE.TASK_NAME) {
      handleValueChange(FIELD_TYPE.TASK_NAME as keyof typeof FIELD_TYPE)(value, data);
    }
  };

  const getRowId = (params: GetRowIdParams<TaskData>) => params.data.id;

  const columnDefs: ColDef<TaskData>[] = [
    {
      headerName: '',
      field: 'status',
      cellRenderer: CheckMark,
      cellRendererParams: (params: ICellRendererParams) => ({
        onStatusValueChange: () => handleValueChange(FIELD_TYPE.STATUS as keyof typeof FIELD_TYPE)(!params.data.status, params.data)
      }),
      width: 55,
      tooltipValueGetter: () => 'Click to complete/uncomplete the task',
      headerClass: 'custom-header'
    },
    {
      headerName: 'Task',
      field: 'taskName',
      editable: true,
      flex: 4.5,
      tooltipValueGetter: () => 'Double-click to edit the task name',
      headerClass: 'custom-header'
    },
    {
      headerName: 'Project',
      field: 'projectName',
      editable: true,
      flex: 3.4,
      cellEditor: DropdownCellEditor,
      cellEditorParams: {
        onSelectOption: handleValueChange(FIELD_TYPE.PROJECT as keyof typeof FIELD_TYPE),
        options: projects,
        displayKey: 'projectName'
      },
      cellEditorPopup: true, // Make sure editor is visible in popup
      tooltipValueGetter: () => 'Double-click to change the project',
      headerClass: 'custom-header'
    },
    {
      headerName: 'User',
      field: 'fullName',
      editable: true,
      flex: 2.4,
      cellEditor: DropdownCellEditor,
      cellEditorParams: {
        onSelectOption: handleValueChange(FIELD_TYPE.USER as keyof typeof FIELD_TYPE),
        options: users,
        displayKey: 'fullName'
      },
      cellEditorPopup: true,
      tooltipValueGetter: () => 'Double-click to assign to a different employee',
      headerClass: 'custom-header'
    },
    {
      headerName: 'Currency',
      field: 'currency',
      flex: 2,
      tooltipValueGetter: () => 'Amount received upon task completion',
      headerClass: 'custom-header'
    },
    {
      headerName: 'Start',
      field: 'startDate',
      flex: 2,
      tooltipValueGetter: () => 'The task was created',
      headerClass: 'custom-header',
      comparator: getDateColumnSortComparator
    },
    {
      headerName: 'Completed',
      field: 'completedDate',
      flex: 2,
      tooltipValueGetter: (params) => {
        return params.data?.status
          ? 'The task was completed'
          : 'Click on the red clock to complete the task';
      },
      headerClass: 'custom-header',
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
        loadingOverlayComponent={Spinner}
        loading={
          isLoading
          || isSavingTask
          || isSavingProject
          || isSavingUser
        }
      />
    </div>
  )
};

export default TaskTable;
