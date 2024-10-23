import { render } from '@testing-library/react';
import { AgGridReact } from 'ag-grid-react';
import DataGrid from './DataGrid';
import { DataGridProps } from '../../types/aggrid';
import { RowData } from '@/types/users';

// Mock AgGridReact to avoid actual grid rendering during tests
jest.mock('ag-grid-react', () => ({
  AgGridReact: jest.fn(() => null),
}));

const mockProps: DataGridProps<RowData> = {
  rowData: [],
  columnDefs: [{ headerName: 'Persons', field: 'fullName' }],
  onRowClicked: jest.fn(),
  getRowClass: jest.fn(),
};

describe('DataGrid Component', () => {
  it('should render AgGridReact component', () => {
    render(<DataGrid {...mockProps} />);

    // Check if AgGridReact has been rendered
    expect(AgGridReact).toHaveBeenCalledTimes(1);
  });

  it('should pass defaultColDef with flex: 1 and resizable: false', () => {
    render(<DataGrid {...mockProps} />);

    // Check if defaultColDef is initialized with flex: 1 and resizable: false
    const expectedDefaultColDef = {
      resizable: false,
    };

    // Verify that the expected defaultColDef is passed to AgGridReact
    expect(AgGridReact).toHaveBeenCalledWith(
      expect.objectContaining({
        defaultColDef: expectedDefaultColDef,
        rowData: mockProps.rowData,
        columnDefs: mockProps.columnDefs,
      }),
      {}
    );
  });
});
