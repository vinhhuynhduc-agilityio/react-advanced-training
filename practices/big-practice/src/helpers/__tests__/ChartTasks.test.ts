import {
  formatDataForChartTotalTasks,
  formatDataForChartTotalTasksByProjects,
  formatDataForChartIndividualEmployee,
} from "../chartTasks";
import { mockTasks, mockProject } from "../../mocks/data";

describe("formatDataForChartTotalTasks", () => {
  it("should correctly format task completion data for 2023 and 2024", () => {
    const result = formatDataForChartTotalTasks(mockTasks);

    // Expecting counts based on the provided mock data
    expect(result).toEqual([
      { month: "Jan", 2023: 0, 2024: 0 },
      { month: "Feb", 2023: 0, 2024: 1 },
      { month: "Mar", 2023: 0, 2024: 0 },
      { month: "Apr", 2023: 0, 2024: 0 },
      { month: "May", 2023: 0, 2024: 0 },
      { month: "Jun", 2023: 0, 2024: 0 },
      { month: "Jul", 2023: 0, 2024: 0 },
      { month: "Aug", 2023: 0, 2024: 0 },
      { month: "Sep", 2023: 0, 2024: 0 },
      { month: "Oct", 2023: 0, 2024: 2 },
      { month: "Nov", 2023: 0, 2024: 1 },
      { month: "Dec", 2023: 0, 2024: 0 },
    ]);
  });
});

describe("formatDataForChartTotalTasksByProjects", () => {
  it("should correctly format task data grouped by projects for 2023 and 2024", () => {
    const result = formatDataForChartTotalTasksByProjects(
      mockTasks,
      mockProject
    );

    // Update expected data to match the logic output
    expect(result).toEqual([
      { projectName: "Support", 2023: 0, 2024: 1 },
      { projectName: "Failure Testing", 2023: 2, 2024: 0 },
      { projectName: "Quality Management", 2023: 0, 2024: 0 },
      { projectName: "Data Quality", 2023: 0, 2024: 0 },
      { projectName: "Test", 2023: 0, 2024: 2 },
    ]);
  });
});

describe("formatDataForChartIndividualEmployee", () => {
  it("should return the total tasks completed by the given user per month", () => {
    const selectedUserId = "d290f1ee-6c54-4b01-90e6-d701748f0851";
    const result = formatDataForChartIndividualEmployee(
      mockTasks,
      selectedUserId
    );

    // Update expected data to match the logic output
    expect(result).toEqual([
      { month: "Jan", totalTasksCompleted: 0 },
      { month: "Feb", totalTasksCompleted: 0 },
      { month: "Mar", totalTasksCompleted: 0 },
      { month: "Apr", totalTasksCompleted: 0 },
      { month: "May", totalTasksCompleted: 0 },
      { month: "Jun", totalTasksCompleted: 0 },
      { month: "Jul", totalTasksCompleted: 0 },
      { month: "Aug", totalTasksCompleted: 0 },
      { month: "Sep", totalTasksCompleted: 0 },
      { month: "Oct", totalTasksCompleted: 1 },
      { month: "Nov", totalTasksCompleted: 1 },
      { month: "Dec", totalTasksCompleted: 0 },
    ]);
  });
});
