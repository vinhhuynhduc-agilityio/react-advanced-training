import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// component
import { ChartTotalTasksCompleted } from '.';

// mock data
import { mockTasks } from '@/mocks';

// Mock AgCharts
jest.mock('ag-charts-react', () => ({
  AgCharts: () => <div data-testid="mocked-chart"></div>,
}));

// Mock helpers
jest.mock('@/components/Chart/helpers', () => ({
  ...jest.requireActual('@/components/Chart/helpers'),
  formatDataForChartTotalTasks: jest.fn(() => [
    { month: 'January', '2023': 5, '2024': 10 },
    { month: 'February', '2023': 3, '2024': 7 },
  ]),
}));

describe('ChartTotalTasksCompleted Component', () => {
  it('renders the mocked chart when isLoading is false', () => {
    render(
      <ChartTotalTasksCompleted isLoading={false} tasks={mockTasks} />
    );

    const mockedChart = screen.getByTestId('mocked-chart');
    expect(mockedChart).toBeInTheDocument();
    expect(screen.getByRole('figure', { name: /chart showing total tasks completed/i })).toBeInTheDocument();
  });

  it('matches snapshot for mocked chart', () => {
    const { container } = render(
      <ChartTotalTasksCompleted isLoading={false} tasks={mockTasks} />
    );

    expect(container).toMatchSnapshot();
  });

  it('renders a spinner when isLoading is true', () => {
    render(
      <ChartTotalTasksCompleted isLoading={true} tasks={mockTasks} />
    );

    const spinner = screen.getByRole('figure', {
      name: /loading chart: total tasks completed/i,
    });
    expect(spinner).toBeInTheDocument();

    const mockedChart = screen.queryByTestId('mocked-chart');
    expect(mockedChart).not.toBeInTheDocument();
  });

  it('formats data correctly using the helper function', () => {
    render(
      <ChartTotalTasksCompleted isLoading={false} tasks={mockTasks} />
    );

    // Check if the mocked helper function was called
    const { formatDataForChartTotalTasks } = jest.requireMock('@/components/Chart/helpers');
    expect(formatDataForChartTotalTasks).toHaveBeenCalledWith(mockTasks);
  });
});
