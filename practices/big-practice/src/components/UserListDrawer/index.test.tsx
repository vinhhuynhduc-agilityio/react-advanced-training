import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DashboardContext } from '@/context';
import UserListDrawer from '.';
import { mockContextValue } from '@/mocks';

describe('UserListDrawer component', () => {
  it('matches snapshot for default state', () => {
    const { container } = render(
      <DashboardContext.Provider value={mockContextValue}>
        <UserListDrawer
          selectedUserId={null}
          onUserSelected={jest.fn()}
          sourceComponent=""
          registerGridApi={jest.fn()}
          onUserDoubleClicked={jest.fn()}
          isLoading={false}
          isSavingUser={false}
        />
      </DashboardContext.Provider>
    );
    expect(container).toMatchSnapshot();
  });

  it('renders user data correctly', () => {
    render(
      <DashboardContext.Provider value={mockContextValue}>
        <UserListDrawer
          isLoading={false}
          selectedUserId={null}
          onUserSelected={jest.fn()}
          sourceComponent=""
          registerGridApi={jest.fn()}
          onUserDoubleClicked={jest.fn()}
          isSavingUser={false}
        />
      </DashboardContext.Provider>
    );

    // Check if the user names are rendered inside the ag-grid
    expect(screen.getByText('Joe Bloggs')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('should render the selected row with a special class', () => {
    render(
      <DashboardContext.Provider value={mockContextValue}>
        <UserListDrawer
          selectedUserId="d290f1ee-6c54-4b01-90e6-d701748f0851"
          onUserSelected={jest.fn()}
          sourceComponent=""
          registerGridApi={jest.fn()}
          onUserDoubleClicked={jest.fn()}
          isLoading={false}
          isSavingUser={false}
        />
      </DashboardContext.Provider>
    );

    // Check if the row for Joe Bloggs is selected
    expect(screen.getByText('Joe Bloggs').closest('.ag-row')).toHaveClass('ag-row-selected');
  });

  it('should call onGridReady and register GridApi', async () => {
    const mockRegisterGridApi = jest.fn();

    // Render the component and pass the necessary props
    render(
      <DashboardContext.Provider value={mockContextValue}>
        <UserListDrawer
          selectedUserId={null}
          onUserSelected={jest.fn()}
          sourceComponent=""
          registerGridApi={mockRegisterGridApi}
          onUserDoubleClicked={jest.fn()}
          isLoading={false}
          isSavingUser={false}
        />
      </DashboardContext.Provider>
    );
    await waitFor(() => expect(mockRegisterGridApi).toHaveBeenCalled());
  });

  it('should call onUserSelected when a row is clicked', async () => {
    const mockOnUserSelected = jest.fn();

    render(
      <DashboardContext.Provider value={mockContextValue}>
        <UserListDrawer
          selectedUserId={null}
          onUserSelected={mockOnUserSelected}
          sourceComponent=""
          registerGridApi={jest.fn()}
          onUserDoubleClicked={jest.fn()}
          isLoading={false}
          isSavingUser={false}
        />
      </DashboardContext.Provider>
    );

    // Simulate a click on the row for Joe Bloggs
    const row = screen.getByText('Joe Bloggs');
    if (row) {
      fireEvent.click(row);
    }

    // Check that the onUserSelected function was called with the correct user ID
    await waitFor(() => expect(mockOnUserSelected).toHaveBeenCalledWith('d290f1ee-6c54-4b01-90e6-d701748f0851'));
  });

  it('should call onUserDoubleClicked when a row is double-clicked', async () => {
    const mockOnUserDoubleClicked = jest.fn();

    // Render the component
    render(
      <DashboardContext.Provider value={mockContextValue}>
        <UserListDrawer
          selectedUserId={null}
          onUserSelected={jest.fn()}
          sourceComponent=""
          registerGridApi={jest.fn()}
          onUserDoubleClicked={mockOnUserDoubleClicked}
          isLoading={false}
          isSavingUser={false}
        />
      </DashboardContext.Provider>
    );

    const rowElement = screen.getByText('Joe Bloggs').closest('.ag-row');

    if (!rowElement) {
      throw new Error('Row not found');
    }

    // Simulate a double-click event
    fireEvent.doubleClick(rowElement);

    // Check if the onUserDoubleClicked function was called with the correct user data
    await waitFor(() => expect(mockOnUserDoubleClicked).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "d290f1ee-6c54-4b01-90e6-d701748f0851",
        fullName: "Joe Bloggs",
        earnings: "$11500",
        email: "john@example.com",
        avatarUrl: "https://i.pravatar.cc/150?img=1",
        registered: "May 21, 2020 17:02:06",
        lastUpdated: "Nov 11, 2024 14:34:21",
      })
    ));
  });
});
