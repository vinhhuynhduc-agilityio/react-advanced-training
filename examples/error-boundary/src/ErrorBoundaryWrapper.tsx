import React, { ReactNode } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

// Define the fallback UI when an error occurs
const ErrorFallback: React.FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
};

// Create a wrapper component that uses ErrorBoundary
interface ErrorBoundaryWrapperProps {
  children: ReactNode;
}

const ErrorBoundaryWrapper: React.FC<ErrorBoundaryWrapperProps> = ({ children }) => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        // Custom error logging can be done here
        console.error('Error caught by ErrorBoundary:', error, errorInfo);
      }}
    >
      {children}
    </ErrorBoundary>
  );
};

export default ErrorBoundaryWrapper;
