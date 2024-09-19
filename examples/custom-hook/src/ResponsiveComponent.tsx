import React from 'react';
import { useWindowSize } from './useWindowSize';

const ResponsiveComponent: React.FC = () => {
  const { width } = useWindowSize();

  return (
    <div>
      <h2>Responsive Content</h2>
      {width > 768 ? (
        <p>This content is visible on large screens.</p>
      ) : (
        <p>This content is visible on small screens.</p>
      )}
    </div>
  );
};

export default ResponsiveComponent;
