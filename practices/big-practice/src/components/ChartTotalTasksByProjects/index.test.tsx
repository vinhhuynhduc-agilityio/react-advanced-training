import {
  render,
  screen
} from '@testing-library/react';
import '@testing-library/jest-dom';

// helpers
import { formatDataForChartTotalTasksByProjects } from '@/helpers/chartTasks';
import { ChartTotalTasksByProjects } from '.';
import { DashboardContext } from '@/context';
import { mockContextValue, mockProject, mockTasks } from '@/mocks';

// component

// Mock AgCharts component to simulate its rendering
jest.mock('ag-charts-react', () => ({
  AgCharts: () => <div data-testid='total-tasks-chart'></div>,
}));

// Mock helper functions
jest.mock('@/helpers/ChartTasks', () => ({
  ...jest.requireActual('@/helpers/ChartTasks'),
  formatDataForChartTotalTasksByProjects: jest.fn(),
}));

describe('ChartTotalTasksByProjects Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the chart component', () => {
    const { container } = render(
      <DashboardContext.Provider value={mockContextValue}>
        <ChartTotalTasksByProjects
          isLoading={false}
        />
      </DashboardContext.Provider>
    );
    expect(screen.getByTestId('total-tasks-chart')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('calls formatDataForChartTotalTasksByProjects with correct data', () => {
    render(
      <DashboardContext.Provider value={mockContextValue}>
        <ChartTotalTasksByProjects
          isLoading={false}
        />
      </DashboardContext.Provider>
    );
    expect(formatDataForChartTotalTasksByProjects).toHaveBeenCalledWith(
      mockTasks,
      mockProject
    );
  });

  it('does not crash if there are no tasks or projects', () => {
    const { container } = render(
      <DashboardContext.Provider value={{ ...mockContextValue, tasks: [], projects: [] }}>
        <ChartTotalTasksByProjects
          isLoading={false}
        />
      </DashboardContext.Provider>
    );

    expect(screen.getByTestId('total-tasks-chart')).toBeInTheDocument();
    expect(formatDataForChartTotalTasksByProjects).toHaveBeenCalledWith([], []);
    expect(container).toMatchSnapshot();
  });

  it('renders a spinner when isLoading is true', () => {
    const { container } = render(
      <DashboardContext.Provider value={mockContextValue}>
        <ChartTotalTasksByProjects
          isLoading={true}
        />
      </DashboardContext.Provider>
    );

    const spinner = container.querySelector(
      '.w-12.h-12.border-4.border-gray-300.border-t-blue-500.rounded-full.animate-spin'
    );
    expect(spinner).toBeInTheDocument();

    const mockedChart = screen.queryByTestId('mocked-chart');
    expect(mockedChart).not.toBeInTheDocument();
  });
});
