import { useContext } from 'react';
import { BearStoreContext } from './BearContext';

// Hook to use BearStoreContext in components
export const useBearStoreContext = () => {
  const context = useContext(BearStoreContext);
  
  if (!context) {
    throw new Error('useBearStoreContext must be used within a BearStoreProvider');
  }
  return context;
};
