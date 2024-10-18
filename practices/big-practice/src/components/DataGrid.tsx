import React, { useMemo } from "react";

// ag-grid
import { AgGridReact } from "ag-grid-react";
import { GridOptions } from "ag-grid-community";
import { DataGridProps } from "../types/aggrid";

const DataGrid: React.FC<DataGridProps> = props => {
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      resizable: false,
    };
  }, []);

  const buildGridProps = (): GridOptions => {

    return {
      defaultColDef,
      rowSelection: 'single',
      ...props
    };
  };

  const gridProps = buildGridProps();

  return (
    <AgGridReact
      {...gridProps}
    />
  );
};

export default DataGrid;
