import React, { useState } from "react";

// ag-grid
import { ColDef, RowClassParams, RowClickedEvent } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

// component
import DataGrid from "../DataGrid/DataGrid";
import { PersonRenderer } from "../DataGrid/CustomCellRenderer/PersonRenderer/PersonRenderer";

// style
import '../../style.css'

import {
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

  const columnDefs: ColDef[] = [
    {
      headerName: "Persons",
      field: 'fullName',
      cellRenderer: PersonRenderer,
      headerClass: "custom-header",
      flex: 1
    },
  ];

  return (
    <DataGrid
      rowData={users}
      columnDefs={columnDefs}
      onRowClicked={onRowClicked}
      getRowClass={getRowClass}
      rowHeight={75}
    />
  );
};

export default UserListDrawer;
