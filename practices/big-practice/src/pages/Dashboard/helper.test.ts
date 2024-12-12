import { GridApi } from "ag-grid-community";
import { handleRowSelection, handleScrollingToAddedRow } from './helper';

// Mock function
const mockHandleRowSelected = jest.fn();

// Use fake timers for `setTimeout`
jest.useFakeTimers();

describe("handleScrollingToAddedRow", () => {
  it("should call gridApi.ensureNodeVisible with the correct arguments", () => {
    // Mock gridApi with jest.fn()
    const mockRowNode = {};
    const mockGridApi = {
      getRowNode: jest.fn(() => mockRowNode),
      ensureNodeVisible: jest.fn(),
    } as unknown as GridApi;

    const id = "test-id";
    handleScrollingToAddedRow(id, mockGridApi);

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
    handleScrollingToAddedRow(id, mockGridApi as unknown as GridApi);

    // Fast-forward the timer
    jest.runAllTimers();

    // Ensure no errors occur
    expect(true).toBe(true);
  });
});

describe('handleRowSelection', () => {

  it('should call handleRowSelected with the correct parameters', () => {
    const userId = '123';
    const sourceComponent = 'UsersTable';

    handleRowSelection(userId, sourceComponent, mockHandleRowSelected);

    expect(mockHandleRowSelected).toHaveBeenCalledWith(userId, sourceComponent);
  });

  it('should handle null userId correctly', () => {
    const userId = null;
    const sourceComponent = 'TaskTable';

    handleRowSelection(userId, sourceComponent, mockHandleRowSelected);

    expect(mockHandleRowSelected).toHaveBeenCalledWith(userId, sourceComponent);
  });
});
