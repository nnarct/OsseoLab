// src/store/useSceneStore.ts
import { create } from 'zustand';

interface MeasureState {
  activeMeasure: boolean
  setActiveMeasure: (activeMeasure: boolean) => void;
  panelInfo: string | null;
  setPanelInfo: (panelInfo: string) => void;
}

export const useMeasureStore = create<MeasureState>((set) => ({
  activeMeasure: false,
  setActiveMeasure: (activeMeasure: boolean) => set({activeMeasure}),
  panelInfo: 'Select a point.',
  setPanelInfo: (panelInfo: string) => set({ panelInfo }),
}));