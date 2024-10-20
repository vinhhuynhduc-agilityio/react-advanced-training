import { render, screen, fireEvent } from '@testing-library/react';
import Login from './Login';

// Mock the useAuth context
jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    login: jest.fn(), // Mock the login function
  }),
}));

describe('Login Component', () => {
  test('renders the form correctly', () => {
    render(<Login />);
    expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter role (e.g., admin, user)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('allows user to input username and role', () => {
    render(<Login />);
    const usernameInput = screen.getByPlaceholderText('Enter username');
    const roleInput = screen.getByPlaceholderText('Enter role (e.g., admin, user)');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(roleInput, { target: { value: 'admin' } });

    expect(usernameInput).toHaveValue('testuser');
    expect(roleInput).toHaveValue('admin');
  });
});
