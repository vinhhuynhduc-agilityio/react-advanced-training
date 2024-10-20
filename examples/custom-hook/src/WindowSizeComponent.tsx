import React from 'react';
import { useWindowSize } from './useWindowSize';

const WindowSizeComponent: React.FC = () => {
  // Use custom hook to get window size
  const { width, height } = useWindowSize();

  return (
    <div>
      <h2>Window Size</h2>
      <p>Width: {width}px</p>
      <p>Height: {height}px</p>
    </div>
  );
};

export default WindowSizeComponent;
