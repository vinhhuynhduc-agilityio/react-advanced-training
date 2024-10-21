import { ColDef, RowClassParams, RowClickedEvent } from "ag-grid-community";
import { RowData } from "./users";

export interface DataGridProps {
  rowData: RowData[];
  columnDefs: ColDef<RowData>[];
  onRowClicked: (event: RowClickedEvent) => void;
  getRowClass: (params: RowClassParams) => string;
};