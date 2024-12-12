import {
  render,
  screen,
  fireEvent,
  waitFor,
  act
} from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskTable from '.';
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

const setup = (props = {}) => {
  const setupProps = { ...defaultProps, ...props };
  return render(
    <DashboardContext.Provider value={mockContextValue}>
      <TaskTable {...setupProps} />
    </DashboardContext.Provider>
  );
};

describe('TaskTable', () => {
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

  it('calls stopEditing when window is resized', () => {
    setup();
    fireEvent(window, new Event('resize'));
  });

  it('calls doubleClick on task table and changes cell value to "new cell"', async () => {
    setup();

    const rowElement = screen.getByText("Build test");

    await act(async () => {
      fireEvent.dblClick(rowElement);
    });

    const editingCell = screen.getByDisplayValue('Build test');
    expect(editingCell).toBeInTheDocument();

    fireEvent.change(editingCell, { target: { value: 'new cell' } });

    expect(editingCell).toHaveValue('new cell');

    await act(async () => {
      fireEvent.keyDown(editingCell, { key: 'Enter' })
    });
  });

  it('Calls to change the icon', async () => {
    setup();
    const rowElement = screen.getAllByLabelText("icon");
    await act(async () => {
      fireEvent.click(rowElement[0]);
    });
  });

  it('Calls to change the project', async () => {
    setup();
    const rowSelected = screen.getByRole('gridcell', { name: 'Support' });
    await act(async () => {
      fireEvent.dblClick(rowSelected);
    });

    await waitFor(() => {
      expect(screen.queryAllByRole('gridcell', { name: 'Failure Testing' }).length).toBeGreaterThan(0);
    })
    const cellSelected = screen.getAllByLabelText('Failure Testing');
    await act(async () => {
      fireEvent.click(cellSelected[0]);
    })
  });

  it('Calls to change the user', async () => {
    setup();
    const rowSelected = screen.getByRole('gridcell', { name: 'Alice Brown' });
    await act(async () => {
      fireEvent.dblClick(rowSelected);
    });

    await waitFor(() => {
      expect(screen.queryAllByRole('gridcell', { name: 'Jane Smith' }).length).toBeGreaterThan(0);
    })
    const cellSelected = screen.getAllByLabelText('Jane Smith');
    await act(async () => {
      fireEvent.click(cellSelected[0]);
    })
  });
});
