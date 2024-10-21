import React, { useState } from "react";

// ag-grid
import { ColDef, RowClassParams, RowClickedEvent } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

// component
import DataGrid from "../DataGrid/DataGrid";
import { PersonRenderer } from "../DataGrid/CustomCellRenderer/PersonRenderer";

// style
import '../../style.css'

import {
  RowData,
  UserListDrawerProps
} from "../../types/users";

const UserListDrawer: React.FC<UserListDrawerProps> = ({ users }) => {
  const [selectedRow, setSelectedRow] = useState<string | null>(null);

  const onRowClicked = (event: RowClickedEvent) => {
    const rowId = event.node.id;
    if (rowId) {
      setSelectedRow(rowId);
    } else {
      setSelectedRow(null);
    }
  };

  const getRowClass = (params: RowClassParams) => {
    return params.node.id === selectedRow ? 'ag-row-selected' : '';
  };

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
        onRowClicked={onRowClicked}
        getRowClass={getRowClass}
      />
    </div>
  );
};

export default UserListDrawer;
