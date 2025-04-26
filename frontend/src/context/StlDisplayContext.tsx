import type { PlaneDataType, TransformControlsMode } from '@/types/stlDisplay';
import { createContext, ReactNode, useCallback, useRef, useState } from 'react';
import * as THREE from 'three';
import { v4 as uuid } from 'uuid';

interface StlDisplayContextType {
  planes: PlaneDataType[];
  setPlanes: React.Dispatch<React.SetStateAction<PlaneDataType[]>>;

  activePlaneId: string | null;
  setActivePlaneId: React.Dispatch<React.SetStateAction<string | null>>;

  addPlane: () => void;
  removePlane: (id: string) => void;
  handleCuttingPlaneSelect: (index: number, value: string | undefined) => void;

  updatePlaneProperty: (
    id: string,
    property: Partial<{ mode: TransformControlsMode; frontColor: string; backColor: string; opacity: number }>
  ) => void;

  applyCut: () => void;
  unapplyCut: () => void;

  sceneHandlerRef: React.MutableRefObject<{
    applyCut: () => void;
  } | null>;
  selectedCutPlanes: (string | undefined)[];

  apply: boolean;

  resetModel: () => void;

  toggleAngleActive: () => void;
  isAngleActive: boolean;
}

const StlDisplayContext = createContext<StlDisplayContextType | undefined>(undefined);

export const StlDisplayProvider = ({ children }: { children: ReactNode }) => {
  const [planes, setPlanes] = useState<PlaneDataType[]>([]);
  const [activePlaneId, setActivePlaneId] = useState<string | null>(null);
  const [selectedCutPlanes, setSelectedCutPlanes] = useState<(string | undefined)[]>([undefined, undefined]);
  const sceneHandlerRef = useRef<{ applyCut: () => void } | null>(null);
  const [apply, setApply] = useState<boolean>(false);
  const [isAngleActive, setIsAngleActive] = useState<boolean>(false);
  const toggleAngleActive = () => setIsAngleActive(!isAngleActive);
  const addPlane = useCallback(() => {
    const id = uuid();
    const newPlane = {
      id,
      plane: new THREE.Plane(new THREE.Vector3(1, 0, 0), 0),
      position: new THREE.Vector3(0, 0, 0),
      mode: 'translate' as TransformControlsMode,
      frontColor: '#00ff00',
      backColor: '#ff0000',
      opacity: 0.5,
    };

    setPlanes((prevPlanes) => [...prevPlanes, newPlane]);
    setActivePlaneId(id);
  }, []);

  const handleCuttingPlaneSelect = (index: number, value: string | undefined) => {
    setSelectedCutPlanes((prev) => {
      const updated = [...prev];
      updated[index] = value;

      if (index === 0 && updated[1] === value) {
        updated[1] = undefined;
      }

      return updated;
    });
  };

  const removePlane = useCallback((id: string) => {
    setPlanes((prevPlanes) => prevPlanes.filter((plane) => plane.id !== id));
    setActivePlaneId((prevActiveId) => (prevActiveId === id ? null : prevActiveId));
  }, []);

  const updatePlaneProperty = useCallback(
    (
      id: string,
      property: Partial<{ mode: TransformControlsMode; frontColor: string; backColor: string; opacity: number }>
    ) => {
      setPlanes((prevPlanes) => prevPlanes.map((plane) => (plane.id === id ? { ...plane, ...property } : plane)));
    },
    []
  );

  const applyCut = () => {
    // sceneHandlerRef.current?.applyCut();
    setApply(true);
  };

  const unapplyCut = () => {
    // sceneHandlerRef.current?.applyCut();
    setApply(false);
  };

  const resetModel = () => {
    setPlanes([]);
    unapplyCut();
  };

  return (
    <StlDisplayContext.Provider
      value={{
        applyCut,
        unapplyCut,
        planes,
        activePlaneId,
        setActivePlaneId,
        addPlane,
        removePlane,
        handleCuttingPlaneSelect,
        updatePlaneProperty,
        selectedCutPlanes,
        sceneHandlerRef,
        apply,
        setPlanes,
        resetModel,
        toggleAngleActive,
        isAngleActive,
      }}
    >
      {children}
    </StlDisplayContext.Provider>
  );
};

export { StlDisplayContext };
