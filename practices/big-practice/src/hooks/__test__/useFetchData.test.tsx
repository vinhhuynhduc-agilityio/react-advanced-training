import { render, screen, waitFor } from '@testing-library/react';
import { apiRequest } from '@/services'; // Mock API call
import { mockProject, mockTasks, mockUsers } from '@/mocks';
import { useFetchData } from '@/hooks/useFetchData';

// Mock apiRequest to return mock data
jest.mock('@/services', () => ({
  apiRequest: jest.fn(),
}));

describe('useFetchData', () => {
  beforeEach(() => {
    (apiRequest as jest.Mock).mockReset();
  });

  it('should set isLoading to true initially and fetch data', async () => {
    (apiRequest as jest.Mock)
      .mockResolvedValueOnce(mockUsers)
      .mockResolvedValueOnce(mockTasks)
      .mockResolvedValueOnce(mockProject);

    const TestComponent = () => {
      const { isLoading, users, tasks, projects } = useFetchData();

      if (isLoading) return <div>Loading...</div>;

      return (
        <div>
          <div role="user-count">{users.length}</div>
          <div role="task-count">{tasks.length}</div>
          <div role="project-count">{projects.length}</div>
        </div>
      );
    };

    render(<TestComponent />);

    // Assert that "Loading..." appears during fetch
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => screen.getByRole('user-count'));
    expect(screen.getByRole('user-count').textContent).toBe('3');
    expect(screen.getByRole('task-count').textContent).toBe('5');
    expect(screen.getByRole('project-count').textContent).toBe('5');
  });
});
