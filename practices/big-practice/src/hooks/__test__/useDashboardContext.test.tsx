import { render, screen } from '@testing-library/react';
import { DashboardContext } from '@/context';
import { ReactNode } from 'react';
import { useDashboardContext } from '@/hooks/useDashboardContext';
import { mockContextValue } from '@/mocks';

// Wrapper component to provide context value
const Wrapper = ({ children }: { children: ReactNode }) => {
  return (
    <DashboardContext.Provider value={mockContextValue}>
      {children}
    </DashboardContext.Provider>
  );
};

describe('useDashboardContext', () => {
  it('should throw an error if used outside of DashboardProvider', () => {

    // Test if the hook throws an error when not inside the provider
    const TestComponent = () => {
      useDashboardContext();
      return null;
    };

    expect(() => render(<TestComponent />)).toThrow(
      'useDashboardContext must be used within a DashboardProvider'
    );
  });

  it('should return the correct context value when used inside the provider', () => {

    // Test if the hook returns the correct context value
    const TestComponent = () => {
      const context = useDashboardContext();
      return <div>{context.users[0].fullName}</div>;
    };

    render(
      <Wrapper>
        <TestComponent />
      </Wrapper>
    );

    expect(screen.getByText('Joe Bloggs')).toBeInTheDocument();
  });
});
