import { render, screen } from '@testing-library/react';
import Header from './Header'; // Import Header component

describe('Header Component', () => {
  it('should render the logo, title, and buttons', () => {
    render(<Header />);

    // Check if the logo is rendered with the correct alt text and src attribute
    const logoElement = screen.getByAltText('Logo');
    expect(logoElement).toBeInTheDocument();
    expect(logoElement).toHaveAttribute('src', '/src/assets/logo.png');

    // Check if the title "Team Progress" is rendered
    const titleElement = screen.getByText('Team Progress');
    expect(titleElement).toBeInTheDocument();

    // Check if the "Add a task" button is rendered
    const addTaskButton = screen.getByText('Add a task');
    expect(addTaskButton).toBeInTheDocument();

    // Check if the "Add a project" button is rendered
    const addProjectButton = screen.getByText('Add a project');
    expect(addProjectButton).toBeInTheDocument();
  });
});
