import { render, screen } from '@testing-library/react';
import UserProfile from './UserProfile';

// Mock the useAuth context
jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: { username: 'testuser', role: 'admin' }, // Mocked user data
    logout: jest.fn(), // Mocked logout function
  }),
}));

describe('UserProfile Component', () => {
  test('displays user information correctly', () => {
    render(<UserProfile />);

    // Check if the user data is displayed
    expect(screen.getByText('User Profile')).toBeInTheDocument();
    expect(screen.getByText('Username: testuser')).toBeInTheDocument();
    expect(screen.getByText('Role: admin')).toBeInTheDocument();
  });
});
