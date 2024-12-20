
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import Dashboard from '@/pages/Dashboard';
import { mockContextValue, mockProject, mockProjectService, mockTasks, mockTaskService, mockUsers, mockUserService } from '@/mocks';

beforeAll(() => {

  // Mock APIs
  jest.mock('@/services/user', () => mockUserService);
  jest.mock('@/services/task', () => mockTaskService);
  jest.mock('@/services/project', () => mockProjectService);
});

jest.mock('@/hooks/useFetchData', () => ({
  useFetchData: () => ({
    isLoading: false,
    setUsers: jest.fn(),
    setTasks: jest.fn(),
    setProjects: jest.fn(),
    users: mockUsers,
    tasks: mockTasks,
    projects: mockProject,
  }),
}));

jest.mock('@/hooks/useDashboardContext', () => ({
  useDashboardContext: () => ({
    ...mockContextValue
  })
}));

jest.mock('@/services/apiRequest', () => ({
  apiRequest: jest.fn()
}));

jest.mock('@/components/Chart', () => ({
  ChartIndividualEmployeeProgress: () => <div>Mock ChartIndividualEmployeeProgress</div>,
  ChartTotalTasksByProjects: () => <div>Mock ChartTotalTasksByProjects</div>,
  ChartTotalTasksCompleted: () => <div>Mock ChartTotalTasksCompleted</div>,
}));

describe('Dashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  test('matches snapshot', () => {
    const { asFragment } = render(
      <Dashboard />
    );

    // Take a snapshot of the rendered component
    expect(asFragment()).toMatchSnapshot();
  });

  it('Calls to change the user using title and content filter', async () => {
    render(<Dashboard />);

    const targetDivs = screen.getAllByTitle('Double-click to assign to a different employee');

    const targetDiv = targetDivs.find((div) => div.textContent?.includes('Alice Brown'));
    expect(targetDiv).toBeInTheDocument();

    await act(async () => {
      fireEvent.dblClick(targetDiv!);
    });

    const avatar = await screen.findByLabelText('Avatar for Jane Smith');
    expect(avatar).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(avatar);
    });

    expect(avatar).not.toBeInTheDocument();
  });

  test('renders the "Add User" button and triggers the action', async () => {
    render(<Dashboard />);
    expect(screen.getByText(/Team Progress App/i)).toBeInTheDocument();

    const addUserButton = screen.getByText('Add a user');
    expect(addUserButton).toBeInTheDocument();

    // Simulate button click
    fireEvent.click(addUserButton);

    // Wait for the modal to appear
    await waitFor(() => screen.getByText('Cancel'));
    const cancelBtn = screen.getByText('Cancel');
    expect(cancelBtn).toBeInTheDocument();

    // Simulate closing the modal
    fireEvent.click(cancelBtn);
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
  });

  test('calls onClose when clicking the modal overlay', async () => {
    render(
      <Dashboard />
    );

    // Trigger the modal to open
    fireEvent.click(screen.getByText('Add a user'));

    await waitFor(() => screen.getByTestId('modal-overlay'));
    const modalOverlay = screen.getByTestId('modal-overlay');
    expect(screen.queryByTestId('modal-overlay')).toBeInTheDocument();

    fireEvent.click(modalOverlay);
    expect(screen.queryByTestId('modal-overlay')).not.toBeInTheDocument();
  });

  test('calls onSubmit on User form', async () => {
    render(
      <Dashboard />
    );
    const addUserButton = screen.getByText('Add a user');
    expect(addUserButton).toBeInTheDocument();

    // Simulate button click
    await act(async () => {
      fireEvent.click(addUserButton);
    });

    const inputFullName = screen.getByPlaceholderText('Enter full name');
    fireEvent.change(inputFullName, { target: { value: 'New full name' } });
    const inputEmail = screen.getByPlaceholderText('Enter email');
    fireEvent.change(inputEmail, { target: { value: 'bob11111@example.com' } });
    await act(async () => {
      const saveBtn = screen.getByLabelText('save-user');
      fireEvent.click(saveBtn);
    })
    expect(screen.queryByTestId('Add')).not.toBeInTheDocument();
  });

  test('renders the "Add Project" button and triggers the action', async () => {
    render(
      <Dashboard />
    );
    const addProjectButton = screen.getByText('Add a project');
    expect(addProjectButton).toBeInTheDocument();

    // Simulate button click
    await act(async () => {
      fireEvent.click(addProjectButton);
    });
    await waitFor(() => screen.getByText('Cancel'));
    const cancelBtn = screen.getByText('Cancel');
    expect(screen.getByText('Add Project')).toBeInTheDocument();

    fireEvent.click(cancelBtn);
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
  });

  test('calls onClose when clicking the modal overlay', async () => {
    render(
      <Dashboard />
    );

    // Trigger the modal to open
    await act(async () => {
      fireEvent.click(screen.getByText('Add a project'));
    });
    await waitFor(() => screen.getByTestId('modal-overlay'));
    const modalOverlay = screen.getByTestId('modal-overlay');
    expect(screen.queryByTestId('modal-overlay')).toBeInTheDocument();

    fireEvent.click(modalOverlay);
    expect(screen.queryByTestId('modal-overlay')).not.toBeInTheDocument();
  });

  test('calls onSubmit on project form', async () => {
    render(
      <Dashboard />
    );
    const addProjectButton = screen.getByText('Add a project');
    expect(addProjectButton).toBeInTheDocument();

    // Simulate button click
    await act(async () => {
      fireEvent.click(addProjectButton);
    });

    const input = screen.getByPlaceholderText('Enter project name');
    fireEvent.change(input, { target: { value: 'New Project' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(screen.queryByTestId('Save')).not.toBeInTheDocument();
  });

  test('renders the "Add Task" button and triggers the action', async () => {
    render(
      <Dashboard />
    );
    const addTaskButton = screen.getByText('Add a task');
    expect(addTaskButton).toBeInTheDocument();

    // Simulate button click
    await act(async () => {
      fireEvent.click(addTaskButton);
    });
    await waitFor(() => screen.getByText('Cancel'));
    const cancelBtn = screen.getByText('Cancel');
    expect(screen.getByText('Add Task')).toBeInTheDocument();

    fireEvent.click(cancelBtn);
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
  });

  test('calls onSubmit on Task form', async () => {
    render(
      <Dashboard />
    );
    const addTaskButton = screen.getByText('Add a task');
    expect(addTaskButton).toBeInTheDocument();

    // Simulate button click
    await act(async () => {
      fireEvent.click(addTaskButton);
    });
    const inputTask = screen.getByPlaceholderText('Enter task name');
    fireEvent.change(inputTask, { target: { value: 'New task' } });
    const inputCurrency = screen.getByPlaceholderText('Enter currency');
    fireEvent.change(inputCurrency, { target: { value: 1000 } });
    const assigneeDropdown = screen.getByPlaceholderText('Select an assignee');
    fireEvent.click(assigneeDropdown);
    const assigneeOptions = screen.getByRole('option', { name: 'Alice Brown' });
    fireEvent.click(assigneeOptions);
    const dropdown = screen.getByPlaceholderText('Select a project');
    fireEvent.click(dropdown);

    // Select the 'Support' option
    const supportOptions = screen.getByRole('option', { name: 'Support' });
    fireEvent.click(supportOptions);

    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(screen.queryByTestId('Save')).not.toBeInTheDocument();
  });

  test('calls onClose when clicking the modal overlay', async () => {
    render(
      <Dashboard />
    );

    // Trigger the modal to open
    await act(async () => {
      fireEvent.click(screen.getByText('Add a task'));
    });
    await waitFor(() => screen.getByTestId('modal-overlay'));
    const modalOverlay = screen.getByTestId('modal-overlay');
    expect(screen.queryByTestId('modal-overlay')).toBeInTheDocument();

    fireEvent.click(modalOverlay);
    expect(screen.queryByTestId('modal-overlay')).not.toBeInTheDocument();
  });

  test('calls selected row on task form', async () => {
    render(
      <Dashboard />
    );
    const rowSelected = screen.getAllByText('Alice Brown')

    // Simulate button click
    fireEvent.click(rowSelected[0]);
  });

  test('calls doubleClick on user form', async () => {
    render(<Dashboard />);
    const rowSelected = screen.getByRole('listitem', { name: 'Alice Brown' });

    // Simulate button double-click
    await act(async () => {
      fireEvent.dblClick(rowSelected);
    });

    // Wait for 'Edit User' to be in the document
    await waitFor(() => {
      expect(screen.getByText('Edit User')).toBeInTheDocument();
    });

    const saveBtn = screen.getByLabelText('save-user');
    // Click the Save button
    await act(async () => {
      fireEvent.click(saveBtn);
    });
  });

  test('calls selected row on Task form', async () => {
    render(
      <Dashboard />
    );
    const rowSelected = screen.getAllByRole('gridcell', { name: 'Alice Brown' });
    // Simulate button click
    await act(async () => {
      fireEvent.click(rowSelected[1]);
    });
  });

  it('Calls to change the icon', async () => {
    render(
      <Dashboard />
    );
    const rowElement = screen.getAllByLabelText("icon");
    await act(async () => {
      fireEvent.click(rowElement[0]);
    });
  });
});
