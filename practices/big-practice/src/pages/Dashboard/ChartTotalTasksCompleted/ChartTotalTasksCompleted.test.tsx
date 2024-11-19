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
jest.mock("../helpers/ChartTasks", () => ({
  ...jest.requireActual("../helpers/ChartTasks"),
  formatDataForChartTotalTasks: jest.fn(() => [
    { month: "January", "2023": 5, "2024": 10 },
    { month: "February", "2023": 3, "2024": 7 },
  ]),
}));

describe("ChartTotalTasksCompleted Component", () => {
  const mockTasks: TaskData[] = [
    {
      "id": "71e564f4-7c18-47f7-89f2-abe4b7ec2854",
      "userId": "d290f1ee-6c54-4b01-90e6-d701748f0851",
      "projectId": "f2d32cb6-12c7-4ae7-bb28-74f16d1d2cbb",
      "taskName": "Build test",
      "startDate": "10 Aug 24",
      "completedDate": "15 Nov 24",
      "currency": 2000,
      "status": true,
      "projectName": "Support",
      "fullName": "Joe Bloggs"
    },
  ];

  it("renders the mocked chart", () => {
    render(<ChartTotalTasksCompleted tasks={mockTasks} />);
    const mockedChart = screen.getByTestId("mocked-chart");
    expect(mockedChart).toBeInTheDocument();
  });

  it("matches snapshot for mocked chart", () => {
    const { container } = render(<ChartTotalTasksCompleted tasks={mockTasks} />);
    expect(container).toMatchSnapshot();
  });
});
