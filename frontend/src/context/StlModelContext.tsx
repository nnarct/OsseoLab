import { createContext, ReactNode, useState, useEffect } from 'react';
import * as THREE from 'three';

interface StlModelContextType {
  geometries: THREE.BufferGeometry<THREE.NormalBufferAttributes>[];
  setGeometries: React.Dispatch<React.SetStateAction<THREE.BufferGeometry<THREE.NormalBufferAttributes>[]>>;
  meshColors: string[];
  setMeshColors: React.Dispatch<React.SetStateAction<string[]>>;
  updateMeshColor: (index: number, color: string) => void;
  resetMeshColor: (index: number) => void;
  totalMesh: number;
}

const StlModelContext = createContext<StlModelContextType | undefined>(undefined);
const defaultColors = ['#E8D7C0', '#ff8383', '#73ff73', '#7e7eff', '#ADD8E6', '#708090'];
export const StlModelProvider = ({ children }: { children: ReactNode }) => {
  const [geometries, setGeometries] = useState<THREE.BufferGeometry<THREE.NormalBufferAttributes>[]>([]);
  const [meshColors, setMeshColors] = useState<string[]>([]);

  useEffect(() => {
    if (geometries.length > 0) {
      
      setMeshColors(geometries.map((_, index) => defaultColors[index % defaultColors.length]));
    }
  }, [geometries]);
  const totalMesh = geometries.length;

  const updateMeshColor = (index: number, color: string) => {
    setMeshColors((prevColors) => {
      const updated = [...prevColors];
      if (index >= 0 && index < updated.length) {
        updated[index] = color;
      }
      return updated;
    });
  };
  const resetMeshColor = (index: number) => {
    setMeshColors((prevColors) => {
      const updated = [...prevColors];
      if (index >= 0 && index < updated.length) {
        updated[index] = defaultColors[index % defaultColors.length];
      }
      return updated;
    });
  };
  return (
    <StlModelContext.Provider
      value={{ geometries, setGeometries, meshColors, setMeshColors, updateMeshColor, totalMesh, resetMeshColor }}
    >
      {children}
    </StlModelContext.Provider>
  );
};

export { StlModelContext };
