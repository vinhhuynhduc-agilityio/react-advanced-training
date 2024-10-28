import {
  useEffect,
  useRef,
} from "react";

import {
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
  const originalTaskNameRef = useRef<string | null>(null);

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
    value: ProjectsData | UserData | string,
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

  const handleValueChange = (type: FieldType) => (
    value: ProjectsData | UserData | string,
    row: TaskData
  ) => {

    // Get the current value of the field being edited
    const currentValue =
      type === FieldType.TASK_NAME
        ? originalTaskNameRef.current
        : type === FieldType.PROJECT
          ? row.projectName
          : row.fullName;

    const newValue =
      type === FieldType.TASK_NAME
        ? value
        : type === FieldType.PROJECT
          ? (value as ProjectsData).projectName
          : (value as UserData).fullName;

    // If the value hasn't changed, return.
    if (newValue === currentValue) {
      return;
    }

    handleSaveSelect(type, value, row);
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
