import {
  render,
  screen,
  fireEvent,
  waitFor
} from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskDashboard from '.';
import { DashboardContext } from '@/context';
import { mockContextValue, mockTasks } from '@/mocks';

const mockOnTaskRowSelected = jest.fn();
const mockUpdateEarningsForUsers = jest.fn();
const mockUpdateEarningsOnStatusChange = jest.fn();
const mockRegisterGridApiTaskDashboard = jest.fn();

const defaultProps = {
  isLoading: false,
  isSavingTask: false,
  isSavingProject: false,
  isSavingUser: false,
  selectedUserId: null,
  sourceComponent: null,
  onTaskRowSelected: mockOnTaskRowSelected,
  updateEarningsForUsers: mockUpdateEarningsForUsers,
  updateEarningsOnStatusChange: mockUpdateEarningsOnStatusChange,
  registerGridApiTaskDashboard: mockRegisterGridApiTaskDashboard,
  setSavingTask: jest.fn(),
};

jest.mock('@/config', () => ({
  API_BASE_URL: 'http://localhost:3001',
}));


const setup = (props = {}) => {
  const setupProps = { ...defaultProps, ...props };
  return render(
    <DashboardContext.Provider value={mockContextValue}>
      <TaskDashboard {...setupProps} />
    </DashboardContext.Provider>
  );
};

describe('TaskDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('matches snapshot for default state', () => {
    const { container } = setup();
    expect(container).toMatchSnapshot();
  });

  it('renders tasks correctly', () => {
    setup();

    mockTasks.forEach(task => {
      expect(screen.getByText(task.taskName)).toBeInTheDocument();
    });
  });

  it('calls onTaskRowSelected when a row is clicked', async () => {
    setup();

    const rowElement = screen.getByText("Build test").closest('.ag-row');

    if (!rowElement) {
      throw new Error("Row element not found. Ensure that the DOM structure is correct.");
    }

    fireEvent.click(rowElement);

    await waitFor(() => {
      expect(mockOnTaskRowSelected).toHaveBeenCalledWith("d290f1ee-6c54-4b01-90e6-d701748f0851");
    });
  });
});
