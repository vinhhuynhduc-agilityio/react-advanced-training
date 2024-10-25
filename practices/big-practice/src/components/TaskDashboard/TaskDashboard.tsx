import {
  useEffect,
  useRef,
} from "react";

import {
  ProjectsData,
  TaskData,
  TaskDataProps
} from "@/types/table";

// ag-grid
import {
  ColDef,
  GetRowIdParams,
  GridApi,
  GridReadyEvent,
  RowClassParams,
  RowClickedEvent
} from "ag-grid-community";

// components
import { IconRenderer } from "../DataGrid/CustomCellRenderer/StatusIcon/StatusIcon";
import { ProjectDropdownEditor } from "../DataGrid/CustomCellRenderer/ProjectDropdownEditor/ProjectDropdownEditor";
import DataGrid from "../DataGrid/DataGrid";

// api
import { apiRequest } from '../../utils/apiRequest';

const TaskDashboard: React.FC<TaskDataProps> = ({
  tasks,
  selectedUserId,
  onTaskRowSelected,
  projects,
  sourceComponent
}) => {
  const gridApi = useRef<GridApi | null>(null);
  const tasksRef = useRef(tasks);

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

        if (rowNode) {

          // Scroll to row with matching userId
          gridApi.current.ensureNodeVisible(rowNode, 'middle');
        }
      }
    }
  }, [selectedUserId, sourceComponent]);

  const handleSaveProjectSelect = async (
    value: ProjectsData,
    rowData: TaskData
  ) => {

    // Update the selected row data with new project value
    const updatedRow = {
      ...rowData,
      projectName: value.projectName,
      projectId: value.id
    };

    // Call API to update row in the backend
    await apiRequest<TaskData, TaskData>(
      'PUT',
      `http://localhost:3001/tasks/${rowData.id}`,
      updatedRow
    );

    if (gridApi.current) {
      const rowNode = gridApi.current.getRowNode(rowData.id);

      if (rowNode) {

        // Update the row data in the grid
        rowNode.setData(updatedRow);
      }
    }
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
      cellEditor: ProjectDropdownEditor,
      cellEditorParams: {
        onSelectProject: handleSaveProjectSelect,
        projects,
      },
      cellEditorPopup: true, // Make sure editor is visible in popup
      cellEditorPopupPosition: "under", // Show popup right below the cell
    },
    {
      headerName: "User",
      field: "fullName",
      flex: 2.4,
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
      <DataGrid<TaskData>
        rowData={tasks}
        columnDefs={columnDefs}
        onRowClicked={handleRowClicked}
        getRowClass={getRowClass}
        onGridReady={onGridReady}
        getRowId={getRowId}
      />
    </div>
  )
};

export default TaskDashboard;
