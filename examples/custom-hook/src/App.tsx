import React from 'react';
import WindowSizeComponent from './WindowSizeComponent';
import ResponsiveComponent from './ResponsiveComponent';

const App: React.FC = () => {
  return (
    <div>
      <h1>Custom Hook Example</h1>
      <WindowSizeComponent />
      <ResponsiveComponent />
    </div>
  );
};

export default App;
