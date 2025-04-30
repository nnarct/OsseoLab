// src/store/useSceneStore.ts
import { create } from 'zustand';
import { Scene } from 'three';

interface SceneState {
  scene: Scene | null;
  setScene: (scene: Scene) => void;
}

export const useSceneStore = create<SceneState>((set) => ({
  scene: null,
  setScene: (scene: Scene) => set({ scene }),
}));
