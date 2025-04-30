import * as THREE from 'three';

export interface MarkerProps {
  position: THREE.Vector3;
  normal: THREE.Vector3;
  radius: number;
  lookAtNormal?: boolean;
}

export interface IntersectionData {
  point: THREE.Vector3;
  normal: THREE.Vector3;
}

export interface MarkerPairDataType {
  id: string;
  origin: IntersectionData;
  destination: IntersectionData;
  distance: number;
  show: boolean;
}

export interface AngleGroupDataType {
  id: string;
  origin: IntersectionData;
  middle: IntersectionData;
  destination: IntersectionData;
  angleDeg: number;
  show: boolean;
}

// todo: rename fle
