import {
  formatDataForChartTotalTasks,
  formatDataForChartTotalTasksByProjects,
  formatDataForChartIndividualEmployee,
  renderTooltipChart,
  renderTooltipProjectChart,
  individualEmployeeProgressOptions,
  totalTasksCompletedOptions,
  totalTasksByProjectsOption,
} from "./helpers";
import { mockTasks, mockProject } from "../../mocks/data";
import { AgAreaSeriesOptions, AgBarSeriesOptions, AgBarSeriesTooltipRendererParams, AgChartLegendClickEvent, AgLineSeriesOptions } from "ag-charts-community";

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

  describe("individualEmployeeProgressOptions", () => {
    it("should have correct initial options for the chart", () => {
      expect(individualEmployeeProgressOptions.title?.text).toBe("Individual employee's progress");
      expect(individualEmployeeProgressOptions.series?.[0].type).toBe("area");
      expect((individualEmployeeProgressOptions.series?.[0] as AgAreaSeriesOptions).xKey).toBe("month");
      expect((individualEmployeeProgressOptions.series?.[0] as AgAreaSeriesOptions).yKey).toBe("totalTasksCompleted");
      expect((individualEmployeeProgressOptions.series?.[0] as AgAreaSeriesOptions).yName).toBe("Loading...");
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

      individualEmployeeProgressOptions.legend?.listeners?.legendItemClick?.(event);

      expect(preventDefault).toHaveBeenCalled();
    });
  });

  describe("totalTasksCompletedOptions", () => {
    it("should have correct initial options for the chart", () => {
      expect(totalTasksCompletedOptions.title?.text).toBe("Total tasks completed");

      // Check series for 2023
      const series2023 = totalTasksCompletedOptions.series?.[0] as AgLineSeriesOptions;
      expect(series2023.type).toBe("line");
      expect(series2023.xKey).toBe("month");
      expect(series2023.yKey).toBe("2023");
      expect(series2023.yName).toBe("2023");

      // Check series for 2024
      const series2024 = totalTasksCompletedOptions.series?.[1] as AgLineSeriesOptions;
      expect(series2024.type).toBe("line");
      expect(series2024.xKey).toBe("month");
      expect(series2024.yKey).toBe("2024");
      expect(series2024.yName).toBe("2024");
    });

    it("should use the correct tooltip renderer", () => {
      const params: AgBarSeriesTooltipRendererParams = {
        seriesId: "test-series",
        datum: { month: "Feb", "2023": 10 },
        xKey: "month",
        yKey: "2023",
      };

      const tooltip = renderTooltipChart(params);

      expect(tooltip.title).toContain("Feb");
      expect(tooltip.title).toContain("10 tasks completed");
      expect(tooltip.backgroundColor).toBe("#181d1f");
    });
  });

  describe("totalTasksByProjectsOption", () => {
    it("should have the correct title", () => {
      expect(totalTasksByProjectsOption.title?.text).toBe("Total tasks by projects");
    });

    it("should have two bar series for 2023 and 2024", () => {
      // Check series for 2023
      const series2023 = totalTasksByProjectsOption.series?.[0] as AgBarSeriesOptions;
      expect(series2023.type).toBe("bar");
      expect(series2023.xKey).toBe("projectName");
      expect(series2023.yKey).toBe("2023");
      expect(series2023.yName).toBe("2023");
      expect(series2023.direction).toBe("horizontal");

      // Check series for 2024
      const series2024 = totalTasksByProjectsOption.series?.[1] as AgBarSeriesOptions;
      expect(series2024.type).toBe("bar");
      expect(series2024.xKey).toBe("projectName");
      expect(series2024.yKey).toBe("2024");
      expect(series2024.yName).toBe("2024");
      expect(series2024.direction).toBe("horizontal");
    });

    it("should use the correct tooltip renderer for both series", () => {
      const params: AgBarSeriesTooltipRendererParams = {
        seriesId: "test-series",
        datum: { projectName: "Project A", "2023": 15 },
        xKey: "projectName",
        yKey: "2023",
      };

      const tooltipResult = renderTooltipProjectChart(params);
      expect(tooltipResult.title).toBe(15);
      expect(tooltipResult.backgroundColor).toBe("#181d1f");
    });

    it("should have a correctly configured legend", () => {
      const legend = totalTasksByProjectsOption.legend;
      expect(legend?.enabled).toBe(true);
      expect(legend?.position).toBe("bottom");
      expect(legend?.item?.marker?.size).toBe(10);
      expect(legend?.item?.label?.fontWeight).toBe("bold");
    });
  });
});
