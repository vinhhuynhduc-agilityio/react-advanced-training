import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// types
import { TaskData, ProjectsData } from "@/types/table";

// helpers
import { formatDataForChartTotalTasksByProjects } from "@/helpers/chartTasks";

// component
import ChartTotalTasksByProjects from "./ChartTotalTasksByProjects";

// Mock AgCharts component to simulate its rendering
jest.mock("ag-charts-react", () => ({
  AgCharts: () => <div data-testid="total-tasks-chart"></div>,
}));

// Mock helper functions
jest.mock("@/helpers/ChartTasks", () => ({
  ...jest.requireActual("@/helpers/ChartTasks"),
  formatDataForChartTotalTasksByProjects: jest.fn(),
}));

describe("ChartTotalTasksByProjects Component", () => {
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
    {
      "id": "0f9fd8b0-8f5c-4a25-b301-eebc6d5700d5",
      "userId": "123e4567-e89b-12d3-a456-426614174001",
      "projectId": "e38e56a2-4d3c-469d-8345-45d6b5fae9f9",
      "taskName": "Develop Backend",
      "startDate": "01 Sep 24",
      "completedDate": "15 Nov 24",
      "currency": 5000,
      "status": true,
      "projectName": "Quality Management",
      "fullName": "Bob White"
    },
  ];

  const mockProjects: ProjectsData[] = [
    {
      id: "f2d32cb6-12c7-4ae7-bb28-74f16d1d2cbb",
      projectName: "Support",
    },
    {
      id: "c1c20a2e-f450-4875-96e8-334f92e9b3b5",
      projectName: "Failure Testing",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the chart component", () => {
    const { container } = render(
      <ChartTotalTasksByProjects
        tasks={mockTasks}
        projects={mockProjects}
        isLoading={false}
      />
    );
    expect(screen.getByTestId("total-tasks-chart")).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it("calls formatDataForChartTotalTasksByProjects with correct data", () => {
    render(
      <ChartTotalTasksByProjects
        tasks={mockTasks}
        projects={mockProjects}
        isLoading={false}
      />
    );
    expect(formatDataForChartTotalTasksByProjects).toHaveBeenCalledWith(
      mockTasks,
      mockProjects
    );
  });

  it("does not crash if there are no tasks or projects", () => {
    const { container } = render(
      <ChartTotalTasksByProjects
        tasks={[]}
        projects={[]}
        isLoading={false}
      />
    );

    expect(screen.getByTestId("total-tasks-chart")).toBeInTheDocument();
    expect(formatDataForChartTotalTasksByProjects).toHaveBeenCalledWith([], []);
    expect(container).toMatchSnapshot();
  });

  it("renders a spinner when isLoading is true", () => {
    const { container } = render(
      <ChartTotalTasksByProjects
        tasks={[]}
        projects={[]}
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
