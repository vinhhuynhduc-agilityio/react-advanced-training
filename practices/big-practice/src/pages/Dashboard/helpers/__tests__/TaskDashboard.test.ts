import {
  getUpdatedRow,
  getDateColumnSortComparator
} from "../TaskDashboard";
import { FieldType } from "@/types/fieldEnums";
import {
  mockTasks,
  mockUsers,
  mockProject
} from "../../mocks/data";
import { FieldValue } from "@/types/table";

describe("Utility Functions", () => {
  describe("getUpdatedRow", () => {
    it("should update the row with new project data", () => {
      const row = mockTasks[0];
      const updatedRow = getUpdatedRow(FieldType.PROJECT, mockProject[1], row);

      expect(updatedRow).toEqual({
        ...row,
        projectName: mockProject[1].projectName,
        projectId: mockProject[1].id,
      });
    });

    it("should update the row with new user data", () => {
      const row = mockTasks[0];
      const updatedRow = getUpdatedRow(FieldType.USER, mockUsers[1], row);

      expect(updatedRow).toEqual({
        ...row,
        fullName: mockUsers[1].fullName,
        userId: mockUsers[1].id,
      });
    });

    it("should update the row with a new task name", () => {
      const row = mockTasks[0];
      const newTaskName = "New Task Name";
      const updatedRow = getUpdatedRow(FieldType.TASK_NAME, newTaskName, row);

      expect(updatedRow).toEqual({
        ...row,
        taskName: newTaskName,
      });
    });

    it("should update the row with new status and completed date", () => {
      const row = mockTasks[0];
      const newStatus = { status: false, completedDate: "incomplete" };
      const updatedRow = getUpdatedRow(FieldType.STATUS, newStatus, row);

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
});