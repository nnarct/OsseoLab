import type { PlaneDataType, TransformControlsMode } from '@/types/stlDisplay';
import { createContext, ReactNode, useCallback, useRef, useState } from 'react';
import * as THREE from 'three';
import { v4 as uuid } from 'uuid';
import type { IntersectionData, MarkerPairDataType, AngleGroupDataType } from '@/types/measureTool';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import React from 'react';

interface SceneHandlerRefType {
  camera?: THREE.PerspectiveCamera;
  controls?: OrbitControls;
  scene?: THREE.Scene;
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
    toggleAngleVisibility: (id: string) => void;
    removeAngleGroupById: (id: string) => void;
  };

  planeHandler: {
    flipPlane: (planeId: string) => void;
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
    togglePlaneVisibility: (id: string) => void;
    removePlaneById: (id: string) => void;
    toggleActivePlaneId: (planeId: string) => void;
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
    togglePairVisibility: (id: string) => void;
    removePairById: (id: string) => void;
  };

  meshVisibility: {
    visibleMeshes: Record<string, boolean>;
    toggleVisibility: (key: string) => void;
    setVisibleMeshes: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  };

  sceneHandlerRef: React.MutableRefObject<SceneHandlerRefType | null>;
  resetModel: () => void;
  faceFront: () => void;
  faceBottom: () => void;
  faceTop: () => void;
  faceLeft: () => void;
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

  const [visibleMeshes, setVisibleMeshes] = useState<Record<string, boolean>>({});

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
        id: uuid(),
        origin: currentAngleGroup[0],
        middle: currentAngleGroup[1],
        destination: markerData,
        angleDeg,
        show: true,
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
        id: uuid(),
        origin: currentMarker,
        destination: marker,
        distance: currentMarker.point.distanceTo(marker.point),
        show: true,
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

  const togglePairVisibility = (id: string) =>
    setMarkerPairs((prev) => prev.map((pair) => (pair.id === id ? { ...pair, show: !pair.show } : pair)));

  const removePairById = (id: string) => setMarkerPairs((prev) => prev.filter((pair) => pair.id !== id));

  const toggleAngleVisibility = (id: string) =>
    setAngleGroup((prev) => prev.map((group) => (group.id === id ? { ...group, show: !group.show } : group)));

  const removeAngleGroupById = (id: string) => setAngleGroup((prev) => prev.filter((group) => group.id !== id));

  const toggleVisibility = (key: string) => {
    setVisibleMeshes((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const addPlane = useCallback(
    // (position: { x: number; y: number; z: number }) => {
    () => {
      const id = uuid();
      // const origin = new THREE.Vector3(0, 0, 0);
      const meshRef = React.createRef<THREE.Mesh>(); // ✅ create a new ref

      const newPlane = {
        id,
        plane: new THREE.Plane(new THREE.Vector3(0, 0, 1), 0),
        // position: origin,
        // origin,
        meshRef: meshRef,
        mode: 'translate' as TransformControlsMode,
        frontColor: '#5bd389',
        backColor: '#e95e5e',
        opacity: 0.5,
        show: true,
        number: planes[planes.length - 1]?.number + 1 || 1,
      };

      setPlanes((prevPlanes) => [...prevPlanes, newPlane]);
      setActivePlaneId(id);
    },
    [planes]
  );
  const flipPlane = (planeId: string) => {
    setPlanes((prevItems) =>
      prevItems.map((item) => {
        if (item.id !== planeId) return item;

        const flipped = item.plane.clone().negate();

        // try updating mesh if it's active
        const planeMesh = sceneHandlerRef.current?.scene?.getObjectByName(planeId) as THREE.Mesh;
        if (planeMesh) {
          const newNormal = flipped.normal.clone().normalize();
          const quaternion = new THREE.Quaternion().setFromUnitVectors(
            new THREE.Vector3(0, 0, 1), // default Z-plane
            newNormal
          );
          planeMesh.setRotationFromQuaternion(quaternion);
        }

        return {
          ...item,
          plane: flipped,
        };
      })
    );
  };

  const toggleActivePlaneId = (planeId: string) => {
    if (activePlaneId === planeId) {
      setActivePlaneId(null);
      setCurrentTool(null);
    } else {
      setActivePlaneId(planeId);
      setCurrentTool('plane');
    }
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

  const togglePlaneVisibility = (id: string) =>
    setPlanes((prevPlanes) => prevPlanes.map((plane) => (plane.id === id ? { ...plane, show: !plane.show } : plane)));

  const deletePlane = (id: string) => setPlanes((prevPlanes) => prevPlanes.filter((plane) => plane.id !== id));

  const applyCut = () => {
    setApply(true);
  };

  const unapplyCut = () => {
    setApply(false);
  };

  const faceFront = () => {
    if (!sceneHandlerRef.current) {
      return;
    }
    const camera = sceneHandlerRef.current.camera;
    const controls = sceneHandlerRef.current.controls;
    if (!(camera && controls)) {
      return;
    }
    camera.position.set(0, 0, 200);
    controls.target.set(0, 0, 0);
    controls.autoRotate = false;
    controls.update();
  };

  const faceBottom = () => {
    if (!sceneHandlerRef.current) {
      return;
    }
    const camera = sceneHandlerRef.current.camera;
    const controls = sceneHandlerRef.current.controls;
    if (!(camera && controls)) {
      return;
    }
    camera.position.set(0, -200, 0);
    controls.target.set(0, 0, 0);
    controls.autoRotate = false;
    controls.update();
  };

  const faceTop = () => {
    if (!sceneHandlerRef.current) {
      return;
    }
    const camera = sceneHandlerRef.current.camera;
    const controls = sceneHandlerRef.current.controls;
    if (!(camera && controls)) {
      return;
    }
    camera.position.set(0, 200, 0); // กล้องลอยจากข้างบน
    controls.target.set(0, 0, 0);
    controls.autoRotate = false;
    controls.update();
  };

  const faceLeft = () => {
    if (!sceneHandlerRef.current) {
      return;
    }
    const camera = sceneHandlerRef.current.camera;
    const controls = sceneHandlerRef.current.controls;
    if (!(camera && controls)) {
      return;
    }
    camera.position.set(-200, 0, 0); // กล้องจากด้านซ้าย
    controls.target.set(0, 0, 0);
    controls.autoRotate = false;
    controls.update();
  };
  const resetModel = () => {
    setPlanes([]);
    setCurrentTool(null);
    setCurrentMarker(null);
    setMarkerPairs([]);
    setAngleGroup([]);
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
          toggleAngleVisibility,
          removeAngleGroupById,
          // add: () => {}, // placeholder if needed
          // clear: () => setCurrentTool(null), // clear example
        },

        planeHandler: {
          flipPlane,
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
          togglePlaneVisibility,
          removePlaneById: deletePlane,
          toggleActivePlaneId,
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
          togglePairVisibility,
          removePairById,
        },
        meshVisibility: {
          visibleMeshes,
          toggleVisibility,
          setVisibleMeshes,
        },
        sceneHandlerRef,
        resetModel,
        faceFront,
        faceBottom,
        faceTop,
        faceLeft,
      }}
    >
      {children}
    </StlDisplayContext.Provider>
  );
};

export { StlDisplayContext };
