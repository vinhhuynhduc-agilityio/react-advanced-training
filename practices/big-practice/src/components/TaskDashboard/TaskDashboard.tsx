import {
  useEffect,
  useRef,
} from "react";

import {
  FieldValue,
  ProjectsData,
  TaskData,
  TaskDataProps,
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
import { IconRenderer } from "../DataGrid/CustomCellRenderer/StatusIcon/StatusIcon";
import { DropdownCellEditor } from "../DataGrid/CustomCellRenderer/DropdownCellEditor/DropdownCellEditor";
import DataGrid from "../DataGrid/DataGrid";

// api
import { apiRequest } from '../../utils/apiRequest';

// helpers
import { getUpdatedRow } from "./helpers/taskDashboardHelpers";
import { FieldType } from "../../types/fieldEnums";

const TaskDashboard: React.FC<TaskDataProps> = ({
  tasks,
  selectedUserId,
  onTaskRowSelected,
  projects,
  sourceComponent,
  users
}) => {
  const gridApi = useRef<GridApi | null>(null);
  const tasksRef = useRef(tasks);
  const originalTaskNameRef = useRef<string>('');

  const onGridReady = (params: GridReadyEvent) => {
    gridApi.current = params.api;
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
      const idTask = tasksRef.current.find(
        item => item.userId === selectedUserId
      )?.id;

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
      `http://localhost:3001/tasks/${row.id}`,
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
    [FieldType.TASK_NAME]: (): FieldValue => originalTaskNameRef.current || "",
    [FieldType.PROJECT]: (row: TaskData): FieldValue => row.projectName || "",
    [FieldType.USER]: (row: TaskData): FieldValue => row.fullName || "",
    [FieldType.STATUS]: (row: TaskData): FieldValue => row.status || false,
  };

  const getNewValueByColumn = {
    [FieldType.TASK_NAME]: (value: string): FieldValue => value || "",
    [FieldType.PROJECT]: (value: ProjectsData): FieldValue => (value as ProjectsData).projectName || "",
    [FieldType.USER]: (value: UserData): FieldValue => (value as UserData).fullName || "",
    [FieldType.STATUS]: (value: boolean): FieldValue => value,
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
        break;

      case FieldType.USER:
        currentValue = getCurrentValueByColumn[FieldType.USER](row);
        newValue = getNewValueByColumn[FieldType.USER](value as UserData);
        customValue = value;
        break;

      case FieldType.STATUS: {
        const status = value as boolean;

        // Define the formatted date
        const completedDate = status
          ? new Date().toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: '2-digit',
          } as Intl.DateTimeFormatOptions)
          : "incomplete";

        newValue = { status, completedDate };
        customValue = newValue;
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
    },
    {
      headerName: "Task",
      field: "taskName",
      editable: true,
      flex: 4.5,
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
    },
    {
      headerName: "Currency",
      field: "currency",
      flex: 2,
    },
    {
      headerName: "Start",
      field: "startDate",
      flex: 2,
    },
    {
      headerName: "Completed",
      field: "completedDate",
      flex: 2,
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
      />
    </div>
  )
};

export default TaskDashboard;
