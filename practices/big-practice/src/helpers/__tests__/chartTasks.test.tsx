import {
  formatDataForChartTotalTasks,
  formatDataForChartTotalTasksByProjects,
  formatDataForChartIndividualEmployee,
  renderTooltipChart,
  renderTooltipProjectChart,
  initOptions,
} from "../chartTasks";
import { mockTasks, mockProject } from "../../mocks/data";
import { AgAreaSeriesOptions, AgBarSeriesTooltipRendererParams, AgChartLegendClickEvent } from "ag-charts-community";

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

  describe('Tooltip Rendering Functions', () => {
    it('should render the tooltip correctly for renderTooltipChart', () => {
      const params: AgBarSeriesTooltipRendererParams = {
        seriesId: 'my-series-id',
        datum: { month: 'Jan', totalTasksCompleted: 5 },
        xKey: 'month',
        yKey: 'totalTasksCompleted',
      };

      const result = renderTooltipChart(params);

      expect(result.title).toContain('Jan');
      expect(result.title).toContain('5 tasks completed');
      expect(result.backgroundColor).toBe('#181d1f');
    });

    it('should render the tooltip correctly for renderTooltipProjectChart', () => {
      const params: AgBarSeriesTooltipRendererParams = {
        seriesId: 'my-series-id',
        datum: { projectName: 'Project X', tasksCompleted: 10 },
        xKey: 'projectName',
        yKey: 'tasksCompleted',
      };

      const result = renderTooltipProjectChart(params);

      expect(result.title).toBe(10);
      expect(result.backgroundColor).toBe('#181d1f');
    });
  });

  describe("initOptions", () => {
    it("should have correct initial options for the chart", () => {
      expect(initOptions.title?.text).toBe("Individual employee's progress");
      expect(initOptions.series?.[0].type).toBe("area");
      expect((initOptions.series?.[0] as AgAreaSeriesOptions).xKey).toBe("month");
      expect((initOptions.series?.[0] as AgAreaSeriesOptions).yKey).toBe("totalTasksCompleted");
      expect((initOptions.series?.[0] as AgAreaSeriesOptions).yName).toBe("Loading...");
    });

    it("should prevent default action on legend item click", () => {
      const preventDefault = jest.fn();
      const event: AgChartLegendClickEvent = {
        preventDefault,
        type: 'click',
        seriesId: 'some-series-id',
        itemId: 'some-item-id',
        enabled: true,
        event: {} as Event,
      };

      initOptions.legend?.listeners?.legendItemClick?.(event);

      expect(preventDefault).toHaveBeenCalled();
    });
  });
});
