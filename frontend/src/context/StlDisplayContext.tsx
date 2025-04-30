import type { PlaneDataType, TransformControlsMode } from '@/types/stlDisplay';
import { createContext, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { v4 as uuid } from 'uuid';
import type { IntersectionData, MarkerPairDataType, AngleGroupDataType } from '@/types/measureTool';

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
    markerRadius: number;
    setMarkerRadius: React.Dispatch<React.SetStateAction<number>>;
  };

  angleHandler: {
    isActive: boolean;
    // toggle: () => void;
    angleGroup: AngleGroupDataType[];
    currentAngleGroup: IntersectionData[];
    addMarker: (markerData: IntersectionData) => void;
    panelInfo: string | null;
    setPanelInfo: (info: string | null) => void;
    clear: () => void;
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

  const [markerRadius, setMarkerRadius] = useState<number>(1.0);

  // Angle
  const [angleGroup, setAngleGroup] = useState<AngleGroupDataType[]>([]);
  const [currentAngleGroup, setCurrentAngleGroup] = useState<IntersectionData[]>([]);
  const [panelAngleInfo, setAnglePanelInfo] = useState<string | null>('Select a point.');

  const clearAngle = () => {
    setAngleGroup([]);
    setCurrentAngleGroup([]);
  };

  const addAngleMarker = (markerData: IntersectionData) => {
    if (currentAngleGroup.length === 0 || !currentAngleGroup) {
      console.log('Adding origin');
      setCurrentAngleGroup([markerData]);
      setPanelInfo('Select the second point.');
    }
    if (currentAngleGroup.length === 1) {
      console.log('Adding middle');
      setCurrentAngleGroup((prev) => [...(prev || []), markerData]);
      setPanelInfo('Select the third point.');
    }
    if (currentAngleGroup.length === 2) {
      console.log('Adding destination');
      setCurrentAngleGroup((prev) => [...(prev || []), markerData]);
      setPanelInfo('Select the first point.');
      const vecA = currentAngleGroup[0].point.clone().sub(currentAngleGroup[1].point).normalize();
      const vecB = markerData.point.clone().sub(currentAngleGroup[1].point).normalize();
      const angleRad = vecA.angleTo(vecB);
      const angleDeg = THREE.MathUtils.radToDeg(angleRad);
      const newAngleGroup: AngleGroupDataType = {
        origin: currentAngleGroup[0],
        middle: currentAngleGroup[1],
        destination: markerData,
        angleDeg,
      };
      setAngleGroup((prev) => (prev ? [...prev, newAngleGroup] : [newAngleGroup]));
      setCurrentAngleGroup([]);
      setPanelInfo('Select a point.');
    }
  };

  //  todo: rename
  const addMarker = (marker: IntersectionData) => {
    if (currentMarker) {
      const newPair: MarkerPairDataType = {
        origin: currentMarker,
        destination: marker,
        distance: currentMarker.point.distanceTo(marker.point),
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

  // const faceTop = () => {
  //   if (sceneHandlerRef.current) {
  //     const camera = sceneHandlerRef.current.camera;
  //     const controls = sceneHandlerRef.current.controls;
  //     if (camera && controls) {
  //       camera.position.set(0, 60, 0); // กล้องลอยจากข้างบน
  //       controls.target.set(0, 0, 0);
  //       controls.autoRotate = false;
  //       controls.update();
  //     }
  //   }
  // };

  // const faceLeft = () => {
  //   if (sceneHandlerRef.current) {
  //     const camera = sceneHandlerRef.current.camera;
  //     const controls = sceneHandlerRef.current.controls;
  //     if (camera && controls) {
  //       camera.position.set(-60, 0, 0); // กล้องจากด้านซ้าย
  //       controls.target.set(0, 0, 0);
  //       controls.autoRotate = false;
  //       controls.update();
  //     }
  //   }
  // };

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
      console.log('clearing tool:', toolName);
      setCurrentTool(null);
    } else {
      console.log('selecting tool:', toolName);
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
          markerRadius,
          setMarkerRadius,
        },
        angleHandler: {
          isActive: currentTool === 'angle',
          angleGroup,
          currentAngleGroup,
          addMarker: addAngleMarker,
          clear: clearAngle,
          panelInfo: panelAngleInfo,
          setPanelInfo: setAnglePanelInfo,
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
