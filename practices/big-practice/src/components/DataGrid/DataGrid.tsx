import { useMemo } from "react";

// ag-grid
import { AgGridReact } from "ag-grid-react";
import { GridOptions } from "ag-grid-community";
import { DataGridProps } from "@/types/table";

const DataGrid = <T,>(props: DataGridProps<T>) => {
  const defaultColDef = useMemo(() => {
    return {
      resizable: false,
    };
  }, []);

  const buildGridProps = (): GridOptions => {

    return {
      defaultColDef,
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
