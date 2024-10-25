import React, {
  useEffect,
  useRef,
} from "react";

// ag-grid
import {
  ColDef,
  GetRowIdParams,
  GridApi,
  GridReadyEvent,
  RowClassParams,
  RowClickedEvent
} from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

// component
import DataGrid from "../DataGrid/DataGrid";
import { PersonRenderer } from "../DataGrid/CustomCellRenderer/PersonRenderer/PersonRenderer";

// style
import '../../style.css'

import {
  UserData,
  UserListDrawerProps
} from "../../types/table";

const UserListDrawer: React.FC<UserListDrawerProps> = ({
  users,
  selectedUserId,
  onUserSelected,
  sourceComponent
}) => {
  const gridApi = useRef<GridApi | null>(null);

  const onGridReady = (params: GridReadyEvent) => {
    gridApi.current = params.api;
  }

  // When `selectedUserId` changes, scroll to the corresponding row
  useEffect(() => {
    if (
      sourceComponent !== "UserListDrawer"
      && selectedUserId
      && gridApi.current
    ) {
      const rowNode = gridApi.current.getRowNode(selectedUserId);
      if (rowNode) {

        // Scroll to row with matching userId
        gridApi.current.ensureNodeVisible(rowNode, 'middle');
      }
    }
  }, [selectedUserId, sourceComponent]);

  const onRowClicked = (event: RowClickedEvent) => {
    const userId = event.data.id;

    if (userId) {

      // Pass `userId` to parent component
      onUserSelected(userId);
    }
  };

  const getRowClass = (params: RowClassParams) => {
    return params.data.id === selectedUserId
      ? "ag-row-selected"
      : "";
  };

  const getRowId = (params: GetRowIdParams<UserData>): string => {
    return params.data.id;
  };

  const columnDefs: ColDef<UserData>[] = [
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
      onGridReady={onGridReady}
      getRowId={getRowId}
    />
  );
};

export default UserListDrawer;
