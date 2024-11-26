import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TaskData } from "@/types/table";

// component
import ChartTotalTasksCompleted from "./ChartTotalTasksCompleted";

// Mock AgCharts
jest.mock("ag-charts-react", () => ({
  AgCharts: () => <div data-testid="mocked-chart"></div>,
}));

// Mock helpers
jest.mock("@/helpers/ChartTasks", () => ({
  ...jest.requireActual("@/helpers/ChartTasks"),
  formatDataForChartTotalTasks: jest.fn(() => [
    { month: "January", "2023": 5, "2024": 10 },
    { month: "February", "2023": 3, "2024": 7 },
  ]),
}));

describe("ChartTotalTasksCompleted Component", () => {
  const mockTasks: TaskData[] = [
    {
      id: "71e564f4-7c18-47f7-89f2-abe4b7ec2854",
      userId: "d290f1ee-6c54-4b01-90e6-d701748f0851",
      projectId: "f2d32cb6-12c7-4ae7-bb28-74f16d1d2cbb",
      taskName: "Build test",
      startDate: "10 Aug 24",
      completedDate: "15 Nov 24",
      currency: 2000,
      status: true,
      projectName: "Support",
      fullName: "Joe Bloggs",
    },
  ];

  it("renders the mocked chart when isLoading is false", () => {
    render(
      <ChartTotalTasksCompleted
        tasks={mockTasks}
        isLoading={false}
      />
    );
    const mockedChart = screen.getByTestId("mocked-chart");
    expect(mockedChart).toBeInTheDocument();
  });

  it("matches snapshot for mocked chart", () => {
    const { container } = render(
      <ChartTotalTasksCompleted
        tasks={mockTasks}
        isLoading={false}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders a spinner when isLoading is true", () => {
    const { container } = render(
      <ChartTotalTasksCompleted
        tasks={mockTasks}
        isLoading={true}
      />
    );
  
    const spinner = container.querySelector(
      ".w-12.h-12.border-4.border-gray-300.border-t-blue-500.rounded-full.animate-spin"
    );
    expect(spinner).toBeInTheDocument();
  
    const mockedChart = screen.queryByTestId("mocked-chart");
    expect(mockedChart).not.toBeInTheDocument();
  });
});
