import { render, screen } from '@testing-library/react';
import { DashboardContext } from '@/context';
import { ReactNode } from 'react';
import { useEmailValidation } from '@/hooks/useEmailValidation';
import { mockContextValue } from '@/mocks';

const Wrapper = ({ children }: { children: ReactNode }) => {
  return (
    <DashboardContext.Provider value={mockContextValue}>
      {children}
    </DashboardContext.Provider>
  );
};

describe('useEmailValidation', () => {
  it('should return true if email is a duplicate', () => {
    const TestComponent = () => {
      const { isEmailDuplicate } = useEmailValidation('john@example.com');
      return <div>{isEmailDuplicate('jane@example.com') ? 'Duplicate' : 'Unique'}</div>;
    };

    render(
      <Wrapper>
        <TestComponent />
      </Wrapper>
    );

    expect(screen.getByText('Duplicate')).toBeInTheDocument();
  });

  it('should return false if email is not a duplicate', () => {
    const TestComponent = () => {
      const { isEmailDuplicate } = useEmailValidation('john@example.com');
      return <div>{isEmailDuplicate('john12345@example.com') ? 'Duplicate' : 'Unique'}</div>;
    };

    render(
      <Wrapper>
        <TestComponent />
      </Wrapper>
    );

    expect(screen.getByText('Unique')).toBeInTheDocument();
  });

  it('should not flag the default email as a duplicate', () => {
    const TestComponent = () => {
      const { isEmailDuplicate } = useEmailValidation('john@example.com');
      return <div>{isEmailDuplicate('john@example.com') ? 'Duplicate' : 'Unique'}</div>;
    };

    render(
      <Wrapper>
        <TestComponent />
      </Wrapper>
    );

    expect(screen.getByText('Unique')).toBeInTheDocument();
  });
});