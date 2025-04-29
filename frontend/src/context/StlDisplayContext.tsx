import { OrbitControls } from '@react-three/drei';
import type { PlaneDataType, TransformControlsMode } from '@/types/stlDisplay';
import { createContext, ReactNode, useCallback, useRef, useState } from 'react';
import * as THREE from 'three';
import { v4 as uuid } from 'uuid';
import type { IntersectionData, MarkerPairDataType } from '@/types/measureTool';

interface SceneHandlerRefType {
  camera?: THREE.PerspectiveCamera;
  controls?: OrbitControls;
}
interface StlDisplayContextType {
  tool: {
    current: string | null;
    select: {
      measure: () => void;
      angle: () => void;
      plane: () => void;
    };
    clear: () => void;
    toggleTool: (toolName: 'angle' | 'measure' | 'plane') => void;
  };

  angleHandler: {
    isActive: boolean;
    // toggle: () => void;
    // add: () => void;
    // clear: () => void;
  };

  planeHandler: {
    isCut: boolean;
    isActive: boolean;
    activePlaneId: string | null;
    // selectedCutPlanes: (string | undefined)[];
    add: () => void;
    clear: () => void;
    applyCut: () => void;
    unapplyCut: () => void;
    getPlanes: () => PlaneDataType[];
    setPlanes: React.Dispatch<React.SetStateAction<PlaneDataType[]>>;
    remove: (id: string) => void;
    setActivePlaneId: (id: string | null) => void;
    // handleCuttingPlaneSelect: (index: number, value: string | undefined) => void;
    updateProperty: (
      id: string,
      property: Partial<{ mode: TransformControlsMode; frontColor: string; backColor: string; opacity: number }>
    ) => void;
  };

  measureHandler: {
    isActive: boolean;
    currentMarker: IntersectionData | null;
    markerPairs: MarkerPairDataType[];
    panelInfo: string | null;
    addMarker: (marker: IntersectionData) => void;
    removePair: (index: number) => void;
    setPanelInfo: (info: string | null) => void;
    clear: () => void;
  };

  sceneHandlerRef: React.MutableRefObject<SceneHandlerRefType | null>;
  resetModel: () => void;
}

const StlDisplayContext = createContext<StlDisplayContextType | undefined>(undefined);

const allFeatures = [null, 'plane', 'angle', 'measure'];
export const StlDisplayProvider = ({ children }: { children: ReactNode }) => {
  const [currentTool, setCurrentTool] = useState<string | null>(allFeatures[0]);

  const [planes, setPlanes] = useState<PlaneDataType[]>([]);
  const [activePlaneId, setActivePlaneId] = useState<string | null>(null);
  // const [selectedCutPlanes, setSelectedCutPlanes] = useState<(string | undefined)[]>([undefined, undefined]);
  const sceneHandlerRef = useRef<SceneHandlerRefType | null>(null);
  const [isCut, setApply] = useState<boolean>(false);

  const [panelInfo, setPanelInfo] = useState<string | null>('Select a point.');
  const [currentMarker, setCurrentMarker] = useState<IntersectionData | null>(null);
  const [markerPairs, setMarkerPairs] = useState<MarkerPairDataType[]>([]);
  const addMarker = (marker: IntersectionData) => {
    if (currentMarker) {
      const newPair: MarkerPairDataType = {
        origin: currentMarker,
        destination: marker,
      };
      setMarkerPairs((prev) => [...prev, newPair]);
      setCurrentMarker(null);
      return;
    }
    setCurrentMarker(marker);
  };

  const removePair = (index: number) => {
    setMarkerPairs((prev) => prev.filter((_, i) => i !== index));
  };

  const clearMarkers = () => {
    setMarkerPairs([]);
    setCurrentMarker(null);
  };

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

  // const handleCuttingPlaneSelect = (index: number, value: string | undefined) => {
  //   setSelectedCutPlanes((prev) => {
  //     const updated = [...prev];
  //     updated[index] = value;

  //     if (index === 0 && updated[1] === value) {
  //       updated[1] = undefined;
  //     }

  //     return updated;
  //   });
  // };

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
    setApply(true);
  };

  const unapplyCut = () => {
    setApply(false);
  };

  const faceFront = () => {
    if (sceneHandlerRef.current) {
      const camera = sceneHandlerRef.current.camera;
      const controls = sceneHandlerRef.current.controls;
      if (camera && controls) {
        camera.position.set(0, 0, 60);
        controls.target.set(0, 0, 0);
        controls.autoRotate = false;
        controls.update();
      }
    }
  };

  const faceTop = () => {
    if (sceneHandlerRef.current) {
      const camera = sceneHandlerRef.current.camera;
      const controls = sceneHandlerRef.current.controls;
      if (camera && controls) {
        camera.position.set(0, 60, 0); // กล้องลอยจากข้างบน
        controls.target.set(0, 0, 0);
        controls.autoRotate = false;
        controls.update();
      }
    }
  };

  const faceLeft = () => {
    if (sceneHandlerRef.current) {
      const camera = sceneHandlerRef.current.camera;
      const controls = sceneHandlerRef.current.controls;
      if (camera && controls) {
        camera.position.set(-60, 0, 0); // กล้องจากด้านซ้าย
        controls.target.set(0, 0, 0);
        controls.autoRotate = false;
        controls.update();
      }
    }
  };

  const resetModel = () => {
    setPlanes([]);
    setCurrentTool(null);
    setCurrentMarker(null);
    setMarkerPairs([]);
    setPanelInfo('Select a point.');
    unapplyCut();
    faceFront();
  };

  const toggleTool = (toolName: 'angle' | 'measure' | 'plane') => {
    if (currentTool === toolName) {
      setCurrentTool(null);
    } else {
      setCurrentTool(toolName);
    }
  };

  return (
    <StlDisplayContext.Provider
      value={{
        tool: {
          current: currentTool,
          select: {
            measure: () => setCurrentTool('measure'),
            angle: () => setCurrentTool('angle'),
            plane: () => setCurrentTool('plane'),
          },
          clear: () => setCurrentTool(null),
          toggleTool,
        },
        angleHandler: {
          isActive: currentTool === 'angle',
          // add: () => {}, // placeholder if needed
          // clear: () => setCurrentTool(null), // clear example
        },

        planeHandler: {
          isActive: currentTool === 'plane',
          activePlaneId,
          setActivePlaneId,
          // handleCuttingPlaneSelect,
          getPlanes: () => planes,
          setPlanes,
          // selectedCutPlanes,
          add: addPlane,
          isCut,
          clear: () => setPlanes([]),
          remove: removePlane,
          applyCut,
          unapplyCut,
          updateProperty: updatePlaneProperty,
        },
        measureHandler: {
          isActive: currentTool === 'measure',
          currentMarker,
          markerPairs,
          panelInfo,
          addMarker,
          removePair,
          setPanelInfo,
          clear: clearMarkers,
        },
        sceneHandlerRef,
        resetModel,
      }}
    >
      {children}
    </StlDisplayContext.Provider>
  );
};

export { StlDisplayContext };
