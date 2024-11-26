import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserListDrawer from '.';

// Mock data to use in tests
const users = [
  {
    "id": "d290f1ee-6c54-4b01-90e6-d701748f0851",
    "fullName": "Joe Bloggs",
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

jest.mock('@/config', () => ({
  API_BASE_URL: 'http://localhost:3001',
}));

describe('UserListDrawer component', () => {
  it('matches snapshot for default state', () => {
    const { container } = render(
      <UserListDrawer
        users={users}
        selectedUserId={null}
        onUserSelected={jest.fn()}
        sourceComponent=''
        registerGridApi={jest.fn()}
        onUserDoubleClicked={jest.fn()}
        isLoading={false}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('renders user data correctly', () => {
    render(
      <UserListDrawer
        isLoading={false}
        users={users}
        selectedUserId={null}
        onUserSelected={jest.fn()}
        sourceComponent=''
        registerGridApi={jest.fn()}
        onUserDoubleClicked={jest.fn()}
      />
    );

    // Check if the user names are rendered inside the ag-grid
    expect(screen.getByText('Joe Bloggs')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });
});
