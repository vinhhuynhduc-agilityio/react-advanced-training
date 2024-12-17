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

/**
 * Calculate adjusted earnings based on current earnings, currency, and condition
 * @param earnings - String earnings in the format "$12345"
 * @param currency - The currency adjustment amount
 * @param isIncrease - Boolean to determine whether to increase or decrease earnings
 * @returns number - The adjusted earnings value
 */
const calculateAdjustedEarnings = (
  earnings: string,
  currency: number,
  isIncrease: boolean
): number => {
  const currentEarnings = parseInt(earnings.slice(1)) || 0;

  return isIncrease
    ? currentEarnings + currency
    : currentEarnings - currency;
};

export {
  handleScrollingToAddedRow,
  handleRowSelection,
  calculateAdjustedEarnings
};