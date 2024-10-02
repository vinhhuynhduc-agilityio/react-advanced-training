import { ReactNode } from 'react';
import { useBearStore } from '../store/BearStore';
import { BearStoreContext } from './BearContext';

// Provider cho BearStoreContext
export const BearStoreProvider = ({ children }: { children: ReactNode }) => {
  const store = useBearStore();
  return (
    <BearStoreContext.Provider value={store}>
      {children}
    </BearStoreContext.Provider>
  );
};