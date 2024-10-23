import { ColDef, RowClassParams, RowClickedEvent } from "ag-grid-community";

export interface DataGridProps<T> {
  rowData: T[];
  columnDefs: ColDef<T>[];
  onRowClicked?: (event: RowClickedEvent) => void;
  getRowClass?: (params: RowClassParams) => string;
  rowHeight?: number;
};
