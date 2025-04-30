// import { CONVERT_TYPE } from '../../StoreContext';
import { toRenderable } from './toRenderable';
import { Scene } from 'three';

// import { OBJExporter } from 'three/examples/jsm/exporters/OBJExporter';
// import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter';
// import { ColladaExporter } from "three/examples/jsm/exporters/ColladaExporter"
// import { DRACOExporter } from "three/examples/jsm/exporters/DRACOExporter"
// import { PLYExporter } from "three/examples/jsm/exporters/PLYExporter"
// import { MMDExporter } from "three/examples/jsm/exporters/MMDExporter"
// // @ts-ignore
// import { TypedGeometryExporter } from "three/examples/jsm/exporters/TypedGeometryExporter"

export const convert = (scene: Scene): Promise<string> => {
  const copyScene = toRenderable(scene);
  return new Promise((res) => {
    const stl = new STLExporter().parse(copyScene);
    res(stl);
    return;
  });
};
