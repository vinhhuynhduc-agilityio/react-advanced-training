import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // Import Jest DOM matchers
import UserListDrawer from './UserListDrawer'; // Import the component to test

// Mock data to use in tests
const users = [
  {
    "id": "d290f1ee-6c54-4b01-90e6-d701748f0851",
    "fullName": "John Doe",
    "earnings": "$5000",
    "email": "john@example.com",
    "avatarUrl": "https://i.pravatar.cc/150?img=1",
    "registered": "May 21, 2020 17:02:06",
    "lastUpdated": "October 10, 2023 12:30:00"
  },
  {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "fullName": "Jane Smith",
    "earnings": "$6200",
    "email": "jane@example.com",
    "avatarUrl": "https://i.pravatar.cc/150?img=2",
    "registered": "June 10, 2021 09:20:15",
    "lastUpdated": "October 15, 2023 09:45:00"
  },
];

describe('UserListDrawer component', () => {

  // Test 1: Check if the user data is rendered correctly in the grid
  it('renders user data correctly', () => {
    // Render the UserListDrawer component with the mock users data
    render(<UserListDrawer users={users} />);

    // Check if the user names are rendered inside the ag-grid
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });
});
