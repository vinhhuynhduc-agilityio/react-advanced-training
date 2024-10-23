import { TaskData, TaskDataProps } from "@/types/users";

// ag-grid
import { ColDef } from "ag-grid-community";

// components
import { IconRenderer } from "../DataGrid/CustomCellRenderer/StatusIcon/StatusIcon";
import { ProjectDropdownEditor } from "../DataGrid/CustomCellRenderer/ProjectDropdownEditor/ProjectDropdownEditor";
import DataGrid from "../DataGrid/DataGrid";

const TaskDashboard: React.FC<TaskDataProps> = ({ tasks }) => {

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
      />
    </div>
  )
}

export default TaskDashboard;
