import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from './Dashboard';
import { apiRequest } from '@/utils/apiRequest';

// Mock apiRequest to not actually call the API during testing
jest.mock('../../utils/apiRequest');

const mockApiRequest = apiRequest as jest.MockedFunction<typeof apiRequest>;

describe('Dashboard component', () => {
  it('fetches and displays users in UserListDrawer', async () => {
    const users = [
      { id: 1, fullName: 'John Doe', email: 'john.doe@example.com' },
      { id: 2, fullName: 'Jane Smith', email: 'jane.smith@example.com' },
    ];

    mockApiRequest.mockResolvedValueOnce(users);

    // Render component Dashboard
    await act(async () => {
      render(<Dashboard />);
    });

    await waitFor(() => {
      users.forEach((user) => {
        expect(screen.getByText(user.fullName)).toBeInTheDocument();
      });
    });

    expect(mockApiRequest).toHaveBeenCalledTimes(3);
    expect(mockApiRequest).toHaveBeenCalledWith('GET', 'http://localhost:3001/users');
  });
});