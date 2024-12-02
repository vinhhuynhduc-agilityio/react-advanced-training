import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DashboardContext } from '@/context';
import Dashboard from '@/pages/Dashboard';
import { mockContextValue } from '@/mocks';
import { UserData } from '@/types';

// Mocking lazy-loaded components
jest.mock('@/components/UserProfileForm', () => ({
  __esModule: true,
  default: () => <div>UserProfileForm Mock</div>,
}));
jest.mock('@/components/TaskForm', () => ({
  __esModule: true,
  default: () => <div>TaskForm Mock</div>,
}));
jest.mock('@/components/ProjectForm', () => ({
  __esModule: true,
  default: () => <div>ProjectForm Mock</div>,
}));

jest.mock('@/components', () => ({
  ChartIndividualEmployeeProgress: () => <div>ChartIndividualEmployeeProgress Mock</div>,
  ChartTotalTasksByProjects: () => <div>ChartTotalTasksByProjects Mock</div>,
  ChartTotalTasksCompleted: () => <div>ChartTotalTasksCompleted Mock</div>,
  ModalDialog: ({ title, onClose, content }: { title: string, onClose: () => void, content: React.ReactNode }) => (
    <div>
      <div>{title}</div>
      <button onClick={onClose}>Close</button>
      {content}
    </div>
  ),
  Footer: () => <div>Footer Mock</div>,
  Header: ({
    onAddUser,
    onAddTask,
    onAddProject,
  }: {
    onAddUser: () => void;
    onAddTask: () => void;
    onAddProject: () => void;
  }) => (
    <div>
      <button onClick={onAddUser}>Add User</button>
      <button onClick={onAddTask}>Add Task</button>
      <button onClick={onAddProject}>Add Project</button>
    </div>
  ),
  UserListDrawer: ({ onUserDoubleClicked }: { onUserDoubleClicked: (user: UserData) => void }) => (
    <div>
      <button onDoubleClick={() => onUserDoubleClicked({ id: '1', fullName: 'David Smith', earnings: '5000', email: 'Davidsmith@example.com', avatarUrl: '', registered: '', lastUpdated: '' })}>
        Double-click to select user
      </button>
    </div>
  ),
  TaskDashboard: ({ onTaskRowSelected }: { onTaskRowSelected: (task: { id: string; name: string }) => void }) => (
    <div>
      <button onClick={() => onTaskRowSelected({ id: '1', name: 'Row of tasks' })}>
        Row of tasks
      </button>
      <p>TaskDashboard Mock</p>
    </div>
  ),
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
jest.mock('@/components/common', () => ({ Spinner: () => <div>Spinner Mock</div> }));

describe('Dashboard Component', () => {

  it('matches the snapshot', () => {
    const { asFragment } = render(
      <DashboardContext.Provider value={mockContextValue}>
        <Dashboard />
      </DashboardContext.Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('triggers handleTaskRowSelected on task row selection', async () => {
    render(
      <DashboardContext.Provider value={mockContextValue}>
        <Dashboard />
      </DashboardContext.Provider>
    );

    // Find the task button and simulate a click
    const taskButton = screen.getByText('Row of tasks');
    fireEvent.click(taskButton);
  });


  it('triggers onUserDoubleClicked on row double-click', async () => {
    render(
      <DashboardContext.Provider value={mockContextValue}>
        <Dashboard />
      </DashboardContext.Provider>
    );

    // Find the UserListDrawer and simulate a double-click on the row
    const doubleClickButton = screen.getByText('Double-click to select user');

    // Simulate the double-click event
    fireEvent.doubleClick(doubleClickButton);
    await waitFor(() => screen.getByText('UserProfileForm Mock'));
    expect(screen.getByText('UserProfileForm Mock')).toBeInTheDocument();
  });


  it('renders the "Add User" button and triggers the action', async () => {
    render(
      <DashboardContext.Provider value={mockContextValue}>
        <Dashboard />
      </DashboardContext.Provider>
    );
    const addUserButton = screen.getByText('Add User');
    expect(addUserButton).toBeInTheDocument();

    // Simulate button click
    fireEvent.click(addUserButton);

    // Wait for the UserProfileForm component to be loaded
    await waitFor(() => screen.getByText('UserProfileForm Mock'));

    // Assert that the UserProfileForm component is rendered
    expect(screen.getByText('UserProfileForm Mock')).toBeInTheDocument();
  });

  it('renders the "Add Task" button and triggers the action', async () => {
    render(
      <DashboardContext.Provider value={mockContextValue}>
        <Dashboard />
      </DashboardContext.Provider>
    );
    const addTaskButton = screen.getByText('Add Task');
    expect(addTaskButton).toBeInTheDocument();

    // Simulate button click
    fireEvent.click(addTaskButton);

    // Wait for the UserProfileForm component to be loaded
    await waitFor(() => screen.getByText('TaskForm Mock'));

    // Assert that the UserProfileForm component is rendered
    expect(screen.getByText('TaskForm Mock')).toBeInTheDocument();
  });

  it('renders the "Add Project" button and triggers the action', async () => {
    render(
      <DashboardContext.Provider value={mockContextValue}>
        <Dashboard />
      </DashboardContext.Provider>
    );
    const addProjectButton = screen.getByText('Add Project');
    expect(addProjectButton).toBeInTheDocument();

    // Simulate button click
    fireEvent.click(addProjectButton);

    // Wait for the UserProfileForm component to be loaded
    await waitFor(() => screen.getByText('ProjectForm Mock'));

    // Assert that the UserProfileForm component is rendered
    expect(screen.getByText('ProjectForm Mock')).toBeInTheDocument();
  });

  it('renders the charts correctly', () => {
    render(
      <DashboardContext.Provider value={mockContextValue}>
        <Dashboard />
      </DashboardContext.Provider>
    );
    expect(screen.getByText('ChartTotalTasksCompleted Mock')).toBeInTheDocument();
    expect(screen.getByText('ChartIndividualEmployeeProgress Mock')).toBeInTheDocument();
    expect(screen.getByText('ChartTotalTasksByProjects Mock')).toBeInTheDocument();
  });

  it('renders TaskDashboard and other content correctly', () => {
    render(
      <DashboardContext.Provider value={mockContextValue}>
        <Dashboard />
      </DashboardContext.Provider>
    );
    expect(screen.getByText('TaskDashboard Mock')).toBeInTheDocument();
    expect(screen.getByText('Footer Mock')).toBeInTheDocument();
  });
});
