import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// helpers
import { formatDataForChartTotalTasksByProjects } from '@/components/Chart/helpers';
import { ChartTotalTasksByProjects } from '.';

// Mock AgCharts component to simulate its rendering
jest.mock('ag-charts-react', () => ({
  AgCharts: () => <div data-testid="total-tasks-chart"></div>,
}));

// Mock helper functions
jest.mock('@/components/Chart/helpers', () => ({
  ...jest.requireActual('@/components/Chart/helpers'),
  formatDataForChartTotalTasksByProjects: jest.fn(),
}));

// Mock data
import { mockTasks, mockProjects } from '@/mocks';

describe('ChartTotalTasksByProjects Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the chart component', () => {
    const { container } = render(
      <ChartTotalTasksByProjects isLoading={false} tasks={mockTasks} projects={mockProjects} />
    );

    expect(screen.getByTestId('total-tasks-chart')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('calls formatDataForChartTotalTasksByProjects with correct data', () => {
    render(
      <ChartTotalTasksByProjects isLoading={false} tasks={mockTasks} projects={mockProjects} />
    );

    expect(formatDataForChartTotalTasksByProjects).toHaveBeenCalledWith(mockTasks, mockProjects);
  });

  it('does not crash if there are no tasks or projects', () => {
    const { container } = render(
      <ChartTotalTasksByProjects isLoading={false} tasks={[]} projects={[]} />
    );

    expect(screen.getByTestId('total-tasks-chart')).toBeInTheDocument();
    expect(formatDataForChartTotalTasksByProjects).toHaveBeenCalledWith([], []);
    expect(container).toMatchSnapshot();
  });

  it('renders a spinner when isLoading is true', () => {
    const { container } = render(
      <ChartTotalTasksByProjects isLoading={true} tasks={mockTasks} projects={mockProjects} />
    );

    const spinner = container.querySelector(
      '.w-12.h-12.border-4.border-gray-300.border-t-blue-500.rounded-full.animate-spin'
    );
    expect(spinner).toBeInTheDocument();

    const mockedChart = screen.queryByTestId('total-tasks-chart');
    expect(mockedChart).not.toBeInTheDocument();
  });
});
