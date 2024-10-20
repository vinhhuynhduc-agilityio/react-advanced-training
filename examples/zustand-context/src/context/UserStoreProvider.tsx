import { ReactNode } from 'react';
import { UserStoreContext } from './UserContext';
import { useUserStore } from '../store/UserStore';

// Provider cho UserStoreContext
export const UserStoreProvider = ({ children }: { children: ReactNode }) => {

  // Use Zustand store
  const store = useUserStore();

  return (
    <UserStoreContext.Provider value={store}>
      {children}
    </UserStoreContext.Provider>
  );
};