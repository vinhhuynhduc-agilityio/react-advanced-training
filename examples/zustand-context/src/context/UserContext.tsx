import { createContext } from 'react';

interface UserStoreContextType {
  users: string[];
  addUser: (user: string) => void;
}

export const UserStoreContext = createContext<UserStoreContextType | null>(null);
