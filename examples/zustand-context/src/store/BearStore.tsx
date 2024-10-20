import { create } from 'zustand';

interface BearState {
  bears: number;
  increaseBears: () => void;
}

// Create store zustand for `bears`
export const useBearStore = create<BearState>((set) => ({
  bears: 0,
  increaseBears: () => set((state) => ({ bears: state.bears + 1 })),
}));
