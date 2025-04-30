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

export type STLDataType = {
  id: string;
  filename: string;
  url: string;
  original_filename: string;
  created_at: string;
  last_updated: string;
};

export type STLResponseDataType = STLDataType;

export type STLLinkDataType = Pick<STLDataType, 'id' | 'url'>;
