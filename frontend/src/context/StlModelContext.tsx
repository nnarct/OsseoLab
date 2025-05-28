import { CaseModelById } from '@/api/files.api';
import { createContext, ReactNode, useState, useEffect, createRef } from 'react';
import * as THREE from 'three';

interface MeshItem {
  geometry: THREE.BufferGeometry<THREE.NormalBufferAttributes>;
  name: string;
  color: string;
  visible: boolean;
  opacity: number;
  ref: React.RefObject<THREE.Mesh>;
  pre: boolean;
  post: boolean;
  id: string;
}

interface StlModelContextType {
  meshes: MeshItem[];
  setMeshes: React.Dispatch<React.SetStateAction<MeshItem[]>>;
  updateMeshProperty: <K extends keyof MeshItem>(index: number, key: K, value: MeshItem[K]) => void;
  totalMesh: number;
  currentSurgicalType: 'pre' | 'post';
  setCurrentSurgicalType: React.Dispatch<React.SetStateAction<'pre' | 'post'>>;
  initializeMeshes: (loadedGeometries: { url: string; geometry: THREE.BufferGeometry }[], activeMeshes: any[]) => void;
  updateMeshVisibility: (id: string, visible: boolean) => void;
  updateMeshOpacity: (id: string, opacity: number) => void;
  updateMeshColor: (id: string, color: string) => void;
  resetMeshColor: (id: string) => void;
}

const StlModelContext = createContext<StlModelContextType | undefined>(undefined);
const defaultColors = ['#E8D7C0', '#ff8383', '#73ff73', '#7e7eff', '#ADD8E6', '#708090'];

export const StlModelProvider = ({ children }: { children: ReactNode }) => {
  const [meshes, setMeshes] = useState<MeshItem[]>([]);
  const [currentSurgicalType, setCurrentSurgicalType] = useState<'pre' | 'post'>('pre');

  useEffect(() => {
    setMeshes((prev) => (prev.length === 0 ? [] : prev));
  }, []);

  useEffect(() => {
    setMeshes((prev) => (prev.length === 0 ? [] : prev));
  }, []);

  const updateMeshProperty = <K extends keyof MeshItem>(index: number, key: K, value: MeshItem[K]) => {
    setMeshes((prev) => {
      const updated = [...prev];
      if (index >= 0 && index < updated.length) {
        updated[index] = { ...updated[index], [key]: value };
      }
      return updated;
    });
  };

  const initializeMeshes = (
    loadedGeometries: { url: string; geometry: THREE.BufferGeometry }[],
    activeMeshes: CaseModelById[]
  ) => {
    setMeshes(
      () =>
        loadedGeometries
          .map(({ url, geometry }, index) => {
            const match = activeMeshes.find((m) => m.url === url);
            if (!match) return null;
            return {
              geometry,
              id: match.case_file_id ?? '',
              name: match.name ?? 'Unnamed mesh',
              color: defaultColors[index % defaultColors.length],
              visible: true,
              opacity: 1,
              ref: createRef<THREE.Mesh>(),
              pre: match.pre,
              post: match.post,
            };
          })
          .filter(Boolean) as MeshItem[]
    );
  };

  const totalMesh = meshes.length;

  const updateMeshVisibility = (id: string, visible: boolean) => {
    setMeshes((prev) => prev.map((mesh) => (mesh.id === id ? { ...mesh, visible } : mesh)));
  };
  const updateMeshOpacity = (id: string, opacity: number) => {
    setMeshes((prev) => prev.map((mesh) => (mesh.id === id ? { ...mesh, opacity } : mesh)));
  };

  const updateMeshColor = (id: string, color: string) => {
    setMeshes((prev) => prev.map((mesh) => (mesh.id === id ? { ...mesh, color } : mesh)));
  };

  const resetMeshColor = (id: string) => {
    setMeshes((prev) =>
      prev.map((mesh, index) =>
        mesh.id === id ? { ...mesh, color: defaultColors[index % defaultColors.length] } : mesh
      )
    );
  };

  return (
    <StlModelContext.Provider
      value={{
        meshes,
        setMeshes,
        updateMeshProperty,
        totalMesh,
        currentSurgicalType,
        setCurrentSurgicalType,
        updateMeshVisibility,
        updateMeshOpacity,
        updateMeshColor,
        resetMeshColor,
        initializeMeshes,
      }}
    >
      {children}
    </StlModelContext.Provider>
  );
};

export { StlModelContext };

// useEffect(() => {
//   setMeshes((prev) =>
//     geometries.map((geometry, index) => ({
//       geometry,
//       name: names[index] ?? `Mesh ${index + 1}`,
//       color: defaultColors[index % defaultColors.length],
//       visible: true,
//       opacity: 1,
//     }))
//   );
// }, [geometries, names]);
