import { create } from 'zustand';

interface UserState {
  users: string[];
  addUser: (user: string) => void;
}

// Create zustand store for `users`
export const useUserStore = create<UserState>((set) => ({
  users: [],
  addUser: (user: string) => set((state) => ({ users: [...state.users, user] })),
}));
