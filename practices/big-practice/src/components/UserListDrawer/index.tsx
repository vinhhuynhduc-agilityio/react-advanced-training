import React, {
  useEffect,
  useRef,
} from 'react';

// styles
import '../../style.css';

// ag-grid
import {
  ColDef,
  GetRowIdParams,
  GridApi,
  GridReadyEvent,
  RowClassParams,
  RowClickedEvent,
  RowDoubleClickedEvent
} from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

// types
import { UserData } from '@/types';

// component
import { Spinner } from '@/components/common';
import { DataGrid } from '@/components';
import { PersonRenderer } from '@/components/DataGrid';

// hooks
import { useDashboardContext } from '@/hooks';

interface UserListDrawerProps {
  selectedUserId: string | null;
  sourceComponent: string | null;
  onUserSelected: (userId: string | null) => void;
  registerGridApi: (api: GridApi) => void;
  onUserDoubleClicked: (data: UserData) => void;
  isLoading: boolean;
  isSavingUser: boolean;
}

const UserListDrawer: React.FC<UserListDrawerProps> = ({
  selectedUserId,
  onUserSelected,
  sourceComponent,
  registerGridApi,
  onUserDoubleClicked,
  isLoading,
  isSavingUser
}) => {
  const { users } = useDashboardContext();
  const gridApi = useRef<GridApi | null>(null);

  const onGridReady = (params: GridReadyEvent) => {
    gridApi.current = params.api;

    // Pass GridApi to Dashboard via registerGridApi
    registerGridApi(params.api);
  }

  // When `selectedUserId` changes, scroll to the corresponding row
  useEffect(() => {
    if (
      sourceComponent !== 'UserListDrawer'
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
      ? 'ag-row-selected'
      : '';
  };

  const getRowId = (params: GetRowIdParams<UserData>): string => {
    return params.data.id;
  };

  const onRowDoubleClicked = (event: RowDoubleClickedEvent) => {
    onUserDoubleClicked(event.data);
  };

  const columnDefs: ColDef<UserData>[] = [
    {
      headerName: 'Persons',
      field: 'fullName',
      cellRenderer: PersonRenderer,
      headerClass: 'custom-header',
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
      onRowDoubleClicked={onRowDoubleClicked}
      loadingOverlayComponent={Spinner}
      loading={isLoading || isSavingUser}
    />
  );
};

export default UserListDrawer;