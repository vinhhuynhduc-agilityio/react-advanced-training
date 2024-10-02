import { useContext } from 'react';
import { UserStoreContext } from './UserContext';

// Hook to use UserStoreContext in components
export const useUserStoreContext = () => {
  const context = useContext(UserStoreContext);

  if (!context) {
    throw new Error('useUserStoreContext must be used within a UserStoreProvider');
  }
  return context;
};
