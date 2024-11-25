import { render, screen } from '@testing-library/react';
import Header from './Header';

describe('Header Component', () => {
  const mockOnAddUser = jest.fn();
  const mockOnAddProject = jest.fn();
  const mockOnAddTask = jest.fn();

  it('matches snapshot for default state', () => {
    const { container } = render(
      <Header
        onAddUser={mockOnAddUser}
        onAddProject={mockOnAddProject}
        onAddTask={mockOnAddTask}
      />
    );;
    expect(container).toMatchSnapshot();
  });

  it('should render the logo, title, and buttons', () => {
    render(
      <Header
        onAddUser={mockOnAddUser}
        onAddProject={mockOnAddProject}
        onAddTask={mockOnAddTask}
      />
    );
    const logoElement = screen.getByAltText('Logo');
    expect(logoElement).toBeInTheDocument();
    expect(logoElement).toHaveAttribute('src', '/assets/logo.png');

    const titleElement = screen.getByText('Team Progress');
    expect(titleElement).toBeInTheDocument();

    const addTaskButton = screen.getByText('Add a task');
    expect(addTaskButton).toBeInTheDocument();

    const addProjectButton = screen.getByText('Add a project');
    expect(addProjectButton).toBeInTheDocument();
  });

});
