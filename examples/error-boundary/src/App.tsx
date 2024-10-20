import React from 'react';
import BuggyComponent from './BuggyComponent';
import ErrorBoundaryWrapper from './ErrorBoundaryWrapper';

const App: React.FC = () => {
  return (
    <div>
      <h1>React Error Boundary Example with TypeScript</h1>
      <ErrorBoundaryWrapper>
        <BuggyComponent />
      </ErrorBoundaryWrapper>
    </div>
  );
};

export default App;
