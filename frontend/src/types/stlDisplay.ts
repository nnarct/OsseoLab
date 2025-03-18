import type { Plane, Vector3 } from 'three';

export type TransformControlsMode = 'translate' | 'scale' | 'rotate';

export interface PlaneDataType {
  id: string;
  plane: Plane;
  position: Vector3;
  mode: TransformControlsMode;
  frontColor: string;
  backColor: string;
  opacity: number;
}
