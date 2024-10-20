// store.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Define type for state
interface BearState {
  bears: number;
  users: string[];
  increaseBears: () => void;
  fetchUsers: () => Promise<void>;
  resetBears: () => void;
}

// Create a store with async actions and persist middleware
export const useBearStore = create<BearState>()(
  persist(
    (set) => ({
      bears: 0,
      users: [],
      increaseBears: () => set((state) => ({ bears: state.bears + 1 })),
      resetBears: () => set({ bears: 0 }),
      fetchUsers: async () => {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        const data = await response.json();
        set({ users: data.map((user: { name: string }) => user.name) });
      },
    }),
    {
      name: 'bear-storage',
      storage: createJSONStorage(() => localStorage), // Use localStorage to store data
    }
  )
);
