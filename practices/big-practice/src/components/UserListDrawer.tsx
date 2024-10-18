import React from "react";

// ag-grid
import { ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import DataGrid from "./DataGrid";

// component
import { PersonRenderer } from "./DataGrid/PersonRenderer";

// style
import '../style.css';
import {
  RowData,
  UserListDrawerProps
} from "../types/users";

const UserListDrawer: React.FC<UserListDrawerProps> = ({ users }) => {
  const columnDefs: ColDef<RowData>[] = [
    {
      headerName: "Persons",
      field: 'full_name',
      cellRenderer: PersonRenderer,
      autoHeight: true,
      headerClass: "custom-header",
    },
  ];

  return (
    <div className="flex-grow ml-1 mr-2 my-4 h-full w-64 ag-theme-alpine">
      <DataGrid
        rowData={users}
        columnDefs={columnDefs}
      />
    </div>
  );
};

export default UserListDrawer;
