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
