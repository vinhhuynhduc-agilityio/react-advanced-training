import { GridApi } from "ag-grid-community";
import {
  getRegisteredDate,
  formatStartDate,
  handlesScrollingToNewUserOrTask,
} from "../dashboard";

// Use fake timers for `setTimeout`
jest.useFakeTimers();

describe("Utility Functions", () => {

  // Test for getRegisteredDate
  describe("getRegisteredDate", () => {
    it("should return the current date and time in the format 'Nov 10, 2024 20:54:10'", () => {
      // Mock the current date
      const mockDate = new Date("2024-11-10T20:54:10");
      jest.spyOn(global, "Date").mockImplementation(() => mockDate as unknown as Date);

      const result = getRegisteredDate();
      expect(result).toBe("Nov 10, 2024 20:54:10");

      // Restore the original Date implementation
      jest.restoreAllMocks();
    });
  });

  // Test for formatStartDate
  describe("formatStartDate", () => {
    it("should format a Date object into '24 Jan 23'", () => {
      const date = new Date("2023-01-24T00:00:00");
      const result = formatStartDate(date);
      expect(result).toBe("24 Jan 23");
    });
  });

  describe("handlesScrollingToNewUserOrTask", () => {
    it("should call gridApi.ensureNodeVisible with the correct arguments", () => {
      // Mock gridApi with jest.fn()
      const mockRowNode = {};
      const mockGridApi = {
        getRowNode: jest.fn(() => mockRowNode),
        ensureNodeVisible: jest.fn(),
      } as unknown as GridApi;

      const id = "test-id";
      handlesScrollingToNewUserOrTask(id, mockGridApi);

      // Fast-forward the timer
      jest.runAllTimers();

      // Check if getRowNode is called with the correct ID
      expect(mockGridApi.getRowNode).toHaveBeenCalledWith(id);

      // Check if ensureNodeVisible is called with the correct node and position
      expect(mockGridApi.ensureNodeVisible).toHaveBeenCalledWith(mockRowNode, "middle");
    });

    it("should not call gridApi methods if gridApi is null", () => {
      const mockGridApi = null;

      const id = "test-id";
      handlesScrollingToNewUserOrTask(id, mockGridApi as unknown as GridApi);

      // Fast-forward the timer
      jest.runAllTimers();

      // Ensure no errors occur
      expect(true).toBe(true);
    });
  });
});
