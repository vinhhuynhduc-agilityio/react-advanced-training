import { GridApi } from "ag-grid-community";

// Returns the current date and time as a formatted string in the format "Nov 10, 2024 20:54:10".
const getRegisteredDate = () =>
  `${new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  })} ${new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })}`;

//  Format a given Date object into a string with the format "24 Jan 23".
const formatStartDate = (date: Date): string => {
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  });
};

/**
 * Handles scrolling to new user or task
 * Use setTimeOut to ensure `getRowNode` is called
 * after the table has re-rendered and refreshed the data
 */
const handlesScrollingToNewUserOrTask = (
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

export {
  getRegisteredDate,
  formatStartDate,
  handlesScrollingToNewUserOrTask
};
