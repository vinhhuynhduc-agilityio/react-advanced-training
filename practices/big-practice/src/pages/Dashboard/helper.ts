import { GridApi } from 'ag-grid-community';

/**
 * Handles scrolling to new user or task
 * Use setTimeOut to ensure `getRowNode` is called
 * after the table has re-rendered and refreshed the data
 */
const handleScrollingToAddedRow = (
  id: string,
  gridApi: GridApi
) => {
  setTimeout(() => {
    if (gridApi) {
      const rowNode = gridApi.getRowNode(id);

      if (rowNode) {
        gridApi.ensureNodeVisible(rowNode, 'middle');
      }
    }
  }, 100);
};

const handleRowSelection = (
  userId: string | null,
  sourceComponent: string,
  handleRowSelected: (userId: string | null, sourceComponent: string) => void
) => {
  handleRowSelected(userId, sourceComponent);
};

export {
  handleScrollingToAddedRow,
  handleRowSelection
};