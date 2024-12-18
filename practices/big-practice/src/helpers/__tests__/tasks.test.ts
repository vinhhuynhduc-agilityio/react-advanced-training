import {
  getUpdatedRow,
  getDateColumnSortComparator,
  formatDropdownOptions,
  isTaskDuplicate
} from "../tasks";
import {
  mockTasks,
  mockUsers,
  mockProject
} from "../../mocks/data";
import {
  FieldValue
} from "@/types";
import { FIELD_TYPE, FieldType } from "@/constant";

describe("Utility Functions", () => {
  describe("getUpdatedRow", () => {
    it("should update the row with new project data", () => {
      const row = mockTasks[0];
      const updatedRow = getUpdatedRow(FIELD_TYPE.PROJECT as FieldType, mockProject[1], row);

      expect(updatedRow).toEqual({
        ...row,
        projectName: mockProject[1].projectName,
        projectId: mockProject[1].id,
      });
    });

    it("should update the row with new user data", () => {
      const row = mockTasks[0];
      const updatedRow = getUpdatedRow(FIELD_TYPE.USER as FieldType, mockUsers[1], row);

      expect(updatedRow).toEqual({
        ...row,
        fullName: mockUsers[1].fullName,
        userId: mockUsers[1].id,
      });
    });

    it("should update the row with a new task name", () => {
      const row = mockTasks[0];
      const newTaskName = "New Task Name";
      const updatedRow = getUpdatedRow(FIELD_TYPE.TASK_NAME as FieldType, newTaskName, row);

      expect(updatedRow).toEqual({
        ...row,
        taskName: newTaskName,
      });
    });

    it("should update the row with new status and completed date", () => {
      const row = mockTasks[0];
      const newStatus = { status: false, completedDate: "incomplete" };
      const updatedRow = getUpdatedRow(FIELD_TYPE.STATUS as FieldType, newStatus, row);

      expect(updatedRow).toEqual({
        ...row,
        status: newStatus.status,
        completedDate: newStatus.completedDate,
      });
    });

    it("should return the original row for an unhandled field type", () => {
      const row = mockTasks[0];
      const updatedRow = getUpdatedRow("" as FieldType, "value" as FieldValue, row);
      expect(updatedRow).toEqual(row);
    });
  });

  describe("getDateColumnSortComparator", () => {
    it("should correctly compare two valid dates", () => {
      const date1 = "10 Aug 23";
      const date2 = "15 Nov 23";

      expect(getDateColumnSortComparator(date1, date2)).toBe(-1);
      expect(getDateColumnSortComparator(date2, date1)).toBe(1);
    });

    it("should return 0 when dates are equal", () => {
      const date = "15 Nov 23";

      expect(getDateColumnSortComparator(date, date)).toBe(0);
    });

    it("should correctly handle incomplete dates", () => {
      const date1 = "incomplete";
      const date2 = "15 Nov 23";

      expect(getDateColumnSortComparator(date1, date2)).toBe(-1);
      expect(getDateColumnSortComparator(date2, date1)).toBe(1);
    });

    it("should return 0 if both dates are incomplete", () => {
      const date1 = "incomplete";
      const date2 = "incomplete";

      expect(getDateColumnSortComparator(date1, date2)).toBe(0);
    });
  });

  describe("formatDropdownOptions", () => {
    it("should format data into dropdown options with the specified valueKey", () => {
      const mockData = [
        { id: "1", name: "Option 1", description: "This is option 1" },
        { id: "2", name: "Option 2", description: "This is option 2" },
        { id: "3", name: "Option 3", description: "This is option 3" },
      ];

      const expectedResult = [
        { id: "1", value: "Option 1" },
        { id: "2", value: "Option 2" },
        { id: "3", value: "Option 3" },
      ];

      const result = formatDropdownOptions(mockData, "name");

      expect(result).toEqual(expectedResult);
    });

    it("should return an empty array if the input data is empty", () => {
      const mockData: { id: string; name: string }[] = [];
      const expectedResult: { id: string; value: string }[] = [];

      const result = formatDropdownOptions(mockData, "name");

      expect(result).toEqual(expectedResult);
    });
  });

  describe("isTaskDuplicate", () => {
    it("should return true if the task name already exists (case insensitive)", () => {
      const result = isTaskDuplicate(mockTasks, "build test");
      expect(result).toBe(true);
    });

    it("should return false if the task name does not exist", () => {
      const result = isTaskDuplicate(mockTasks, "Non-Existing Task");
      expect(result).toBe(false);
    });

    it("should return true if the task name matches exactly", () => {
      const result = isTaskDuplicate(mockTasks, "Build test");
      expect(result).toBe(true);
    });

    it("should handle empty input task name and return false", () => {
      const result = isTaskDuplicate(mockTasks, "");
      expect(result).toBe(false);
    });

    it("should handle empty task list and return false", () => {
      const result = isTaskDuplicate([], "Build test");
      expect(result).toBe(false);
    });
  });
});

