import { createContext } from 'react';

interface BearStoreContextType {
  bears: number;
  increaseBears: () => void;
}

export const BearStoreContext = createContext<BearStoreContextType | null>(null);