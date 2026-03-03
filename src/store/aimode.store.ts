import { create } from 'zustand';

interface AIModeState {
  isOpen: boolean;
  mode: 'chat' | 'voice';
  open: (mode?: 'chat' | 'voice') => void;
  close: () => void;
  setMode: (mode: 'chat' | 'voice') => void;
}

export const useAIModeStore = create<AIModeState>((set) => ({
  isOpen: false,
  mode: 'chat',
  open: (mode = 'chat') => set({ isOpen: true, mode }),
  close: () => set({ isOpen: false }),
  setMode: (mode) => set({ mode }),
}));
