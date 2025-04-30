import { create } from 'zustand';

interface ItemListPanelState {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const useItemListPanelStateStore = create<ItemListPanelState>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen: boolean) => set({ isOpen }),
}));
