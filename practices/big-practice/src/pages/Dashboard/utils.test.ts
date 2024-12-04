import { handleRowSelection } from './utils';

// Mock function
const mockHandleRowSelected = jest.fn();

describe('handleRowSelection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call handleRowSelected with the correct parameters', () => {
    const userId = '123';
    const sourceComponent = 'UserListDrawer';

    handleRowSelection(userId, sourceComponent, mockHandleRowSelected);

    expect(mockHandleRowSelected).toHaveBeenCalledWith(userId, sourceComponent);
  });

  it('should handle null userId correctly', () => {
    const userId = null;
    const sourceComponent = 'TaskDashboard';

    handleRowSelection(userId, sourceComponent, mockHandleRowSelected);

    expect(mockHandleRowSelected).toHaveBeenCalledWith(userId, sourceComponent);
  });
});
