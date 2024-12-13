import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// component
import { ChartTotalTasksCompleted } from '.';
import { DashboardContext } from '@/context';
import { mockContextValue } from '@/mocks';

// Mock AgCharts
jest.mock('ag-charts-react', () => ({
  AgCharts: () => <div data-testid='mocked-chart'></div>,
}));

// Mock helpers
jest.mock('@/Components/Chart/helpers', () => ({
  ...jest.requireActual('@/Components/Chart/helpers'),
  formatDataForChartTotalTasks: jest.fn(() => [
    { month: 'January', '2023': 5, '2024': 10 },
    { month: 'February', '2023': 3, '2024': 7 },
  ]),
}));

describe('ChartTotalTasksCompleted Component', () => {
  it('renders the mocked chart when isLoading is false', () => {
    render(
      <DashboardContext.Provider value={mockContextValue}>
        <ChartTotalTasksCompleted
          isLoading={false}
          isSavingTask={false}
        />
      </DashboardContext.Provider>
    );
    const mockedChart = screen.getByTestId('mocked-chart');
    expect(mockedChart).toBeInTheDocument();
  });

  it('matches snapshot for mocked chart', () => {
    const { container } = render(
      <DashboardContext.Provider value={mockContextValue}>
        <ChartTotalTasksCompleted
          isLoading={false}
          isSavingTask={false}
        />
      </DashboardContext.Provider>
    );
    expect(container).toMatchSnapshot();
  });

  it('renders a spinner when isLoading is true', () => {
    const { container } = render(
      <DashboardContext.Provider value={mockContextValue}>
        <ChartTotalTasksCompleted
          isLoading={true}
          isSavingTask={false}
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
