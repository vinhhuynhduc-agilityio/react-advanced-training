import { useState, useEffect } from 'react';

interface Size {
  width: number;
  height: number;
}

// Custom hook to track window size
export const useWindowSize = (): Size => {
  const [windowSize, setWindowSize] = useState<Size>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    // Resize handler function
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Assign event when window resize
    window.addEventListener('resize', handleResize);

    // Clean up events when component unmounts
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};
