import { ColDef } from "ag-grid-community";
import { RowData } from "./users";

export interface DataGridProps {
  rowData: RowData[];
  columnDefs: ColDef<RowData>[];
};