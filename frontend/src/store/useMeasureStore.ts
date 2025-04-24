// src/store/useSceneStore.ts
import type { IntersectionData } from '@/types/measureTool';
import { create } from 'zustand';

interface MeasureState {
  activeMeasure: boolean;
  setActiveMeasure: (activeMeasure: boolean) => void;
  panelInfo: string | null;
  setPanelInfo: (panelInfo: string) => void;
  currentMarker: IntersectionData[];
  addMarker: (marker: IntersectionData) => void;
  removePair: (index:number) => void
  markerPairs: MarkerPairDataType[];
  
  setMarkerPairs: (markersPair: MarkerPairDataType[]) => void;
}

export const useMeasureStore = create<MeasureState>((set) => ({
  activeMeasure: false,
  setActiveMeasure: (activeMeasure: boolean) => set({ activeMeasure }),
  panelInfo: 'Select a point.',
  setPanelInfo: (panelInfo: string) => set({ panelInfo }),
  currentMarker: [],
  addMarker: (marker: IntersectionData) =>
    set((state) => {
      const updatedCurrent = [...state.currentMarker, marker];

      if (updatedCurrent.length === 2) {
        const newPair = {
          origin: updatedCurrent[0],
          destination: updatedCurrent[1],
        };

        return {
          currentMarker: [],
          markerPairs: [...state.markerPairs, newPair],
        };
      } else {
        return { currentMarker: updatedCurrent };
      }
    }),
    removePair: (index: number) =>
      set((state) => ({
        markerPairs: state.markerPairs.filter((_, i) => i !== index),
      })),
  markerPairs: [],
  setMarkerPairs: (markerPairs: MarkerPairDataType[]) => set({ markerPairs }),
}));

interface MarkerPairDataType {
  origin: IntersectionData;
  destination: IntersectionData;
}
