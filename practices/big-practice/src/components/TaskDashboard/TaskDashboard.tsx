import {
  useEffect,
  useRef,
  useState
} from "react";

import {
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

const TaskDashboard: React.FC<TaskDataProps> = ({
  tasks,
  selectedUserId,
  onTaskRowSelected
}) => {
  const gridApi = useRef<GridApi | null>(null);
  const tasksRef = useRef(tasks);

  const [selectedTaskUser, setSelectedTaskUser] = useState<string | null>(null);

  const onGridReady = (params: GridReadyEvent) => {
    gridApi.current = params.api;
  }

  useEffect(() => {
    tasksRef.current = tasks;
  }, [tasks]);

  //  When `selectedUserId` changes, scroll to the corresponding row
  useEffect(() => {
    if (selectedUserId && gridApi.current) {
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

      setSelectedTaskUser(selectedUserId);
    }
  }, [selectedUserId]);


  const handleRowClicked = (event: RowClickedEvent) => {
    const userId = event.data.userId;

    if (userId) {
      setSelectedTaskUser(userId);

      // Pass `userId` to parent component
      onTaskRowSelected(userId);
    }
  };

  const getRowClass = (params: RowClassParams) => {
    return params.data.userId === selectedTaskUser
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
      cellEditor: ProjectDropdownEditor,
      cellEditorPopup: true, // Make sure editor is visible in popup
      cellEditorPopupPosition: "under", // Show popup right below the cell
      flex: 3.4,
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
