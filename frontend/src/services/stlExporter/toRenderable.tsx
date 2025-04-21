import * as THREE from "three";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";

const isMesh = (obj: THREE.Object3D): obj is THREE.Mesh => {
  return obj instanceof THREE.Mesh;
};

const toRenderableGeometry = (geom: THREE.BufferGeometry): THREE.BufferGeometry | null => {
  if (!geom.attributes.position) {
    return null;
  }
  const cloned = geom.clone();

  if (cloned.index) {
    const nonIndexed = cloned.toNonIndexed(); // ✅ Expand vertices properly
    cloned.copy(nonIndexed);
  }

  if (!cloned.attributes.normal) {
    cloned.computeVertexNormals();
  }

  if (!cloned.attributes.uv) {
    const count = cloned.attributes.position.count;
    const dummyUVs = new Float32Array(count * 2); // two floats per vertex
    cloned.setAttribute('uv', new THREE.BufferAttribute(dummyUVs, 2));
  }

  return cloned;
};

export const toRenderable = (scene: THREE.Scene): THREE.Scene => {
  const geometries: THREE.BufferGeometry[] = [];

  const cloneScene = scene.clone();
  cloneScene.updateMatrixWorld(true); // ✅ Update world matrices

  cloneScene.traverse((obj) => {
    if (!isMesh(obj)) return;
    if (!obj.geometry) return;
    if (obj.type.includes('Helper')) {
      return;
    }

    const boundingBox = new THREE.Box3().setFromObject(obj);
    const size = new THREE.Vector3();
    boundingBox.getSize(size);
    if (size.length() < 1e-3) {
      return;
    }

    const geom = toRenderableGeometry(obj.geometry);
    if (!geom) return;

    const positionAttr = geom.getAttribute('position') as THREE.BufferAttribute;
    const pos = positionAttr.array as Float32Array;

    if (positionAttr.count < 3) {
      console.warn('Skipping geometry with not enough vertices to form a face');
      return;
    }

    let matrix = obj.matrixWorld.clone();
    if (obj.parent && obj.parent.type === 'Scene') {
      matrix.identity();
    }

    const vector = new THREE.Vector3();
    for (let i = 0; i < pos.length; i += 3) {
      vector.set(pos[i], pos[i + 1], pos[i + 2]);
      vector.applyMatrix4(matrix);
      pos[i] = vector.x;
      pos[i + 1] = vector.y;
      pos[i + 2] = vector.z;
    }

    positionAttr.needsUpdate = true;
    geom.computeBoundingBox();
    geom.computeBoundingSphere();

    if (geom.getAttribute('uv')) {
      geom.deleteAttribute('uv');
    }

    geometries.push(geom);
  });

  if (geometries.length === 0) {
    console.error('No valid geometries to merge!');
    return new THREE.Scene();
  }

  const merged = BufferGeometryUtils.mergeGeometries(geometries, true);

  if (!merged) {
    console.error('Failed to merge geometries!');
    return new THREE.Scene();
  }

  const mesh = new THREE.Mesh(merged, new THREE.MeshBasicMaterial());
  const outputScene = new THREE.Scene();
  outputScene.add(mesh);

  return outputScene;
};