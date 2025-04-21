import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import Controllers from './Controllers';
import Model from './Model';
import ClippingPlane from './ClippingPlane';
import { useStlDisplay } from '@/hooks/useStlDisplay';
import MenuBar from './MenuBar';
import { useEffect, useRef, useState } from 'react';
import { BufferGeometryUtils, STLExporter } from 'three/examples/jsm/Addons.js';
import { axios } from '@/config/axiosConfig';
import { useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { initializeSTLModel } from '@/utils/stlUtils';
import { STL_LIST_QUERY_KEY } from '@/constants/queryKey';
import { CSG } from 'three-csg-ts';
import SceneSetter from './SceneSetter';
import { useSceneStore } from '@/store/useSceneStore';
import { convert } from '@/services/stlExporter/convert';
import Angle from './Angle';

const Center = ({ url, id }: { url: string; id: string }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { planes, resetModel } = useStlDisplay();
  const meshRef = useRef<THREE.Mesh>(null);
  const [angleActive, setAngleActive] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    resetModel();
  }, [url]); // eslint-disable-line react-hooks/exhaustive-deps
  const queryClient = useQueryClient();

  const applyClippingPlanes = (geometry: THREE.BufferGeometry, planes: THREE.Plane[]) => {
    const positions = geometry.attributes.position.array;
    const newPositions = [];

    for (let i = 0; i < positions.length; i += 3) {
      const vertex = new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]);

      let visible = true;
      for (const plane of planes) {
        if (plane.distanceToPoint(vertex) < 0) {
          visible = false;
          break;
        }
      }

      if (visible) {
        newPositions.push(positions[i], positions[i + 1], positions[i + 2]);
      }
    }

    const newGeometry = new THREE.BufferGeometry();
    newGeometry.setAttribute('position', new THREE.Float32BufferAttribute(newPositions, 3));

    return newGeometry;
  };

  const putStlFile = async (formData: FormData) => {
    try {
      const response = await axios.put(`/stl/file/${id}`, formData);
      console.log('File updated successfully:', response.data);
      messageApi.success('File updated successfully');
      queryClient.invalidateQueries({ queryKey: [STL_LIST_QUERY_KEY] });
    } catch (error) {
      messageApi.error('Error updating STL file');
      console.error('Error updating STL file:', error);
    }
  };

  const upload = async (formData: FormData, nickname: string) => {
    try {
      setIsLoading(true);
      const response = await axios.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      messageApi.success(`File "${nickname}" uploaded successfully!`);
      console.log('Uploaded:', response.data);
      queryClient.invalidateQueries({ queryKey: [STL_LIST_QUERY_KEY] });
      messageApi.success('uploaded');
    } catch (error) {
      messageApi.error('Upload failed!');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  const save = async (id: string) => {
    const scene = useSceneStore.getState().scene;
    if (!scene) {
      console.error('Scene not found!');
      return;
    }

    try {
      const result = await convert(scene); // <- await because convert returns Promise<string>

      if (!result) {
        console.error('Convert failed.');
        return;
      }

      // const blob = new Blob([result], { type: 'application/octet-stream' }); // .stl is usually 'application/octet-stream' or 'model/stl'
      const blob = new Blob([result], { type: 'model/stl' }); // .stl is usually 'application/octet-stream' or 'model/stl'
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `${id}.stl`; // file will be saved as e.g., 1234.stl
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url); // clean memory
    } catch (error) {
      console.error('Failed to save STL:', error);
    }
  };

  return (
    <>
      {contextHolder}
      <MenuBar
        onSave={async () => {
          await save(id);
        }}
        saving={isLoading}
      />
      <Canvas style={{ height: '80vh', maxWidth: '80vh', width: 'auto', background: 'black', marginInline: 'auto' }}>
        <SceneSetter />
        <Controllers />
        <Model url={url} meshRef={meshRef} />
        {planes.map((planeObj) => (
          <ClippingPlane key={planeObj.id} {...planeObj} />
        ))}
        {/* <Angle active={angleActive} /> */}
      </Canvas>
    </>
  );
};

export default Center;

// const save = async (id: string, planes: THREE.Plane[]) => {
//   if (!meshRef.current) {
//     console.error('No mesh available to save.');
//     return;
//   }
//   setIsLoading(true);
//   console.log('Exporting with Clipping Planes...');

//   // Clone the mesh to avoid modifying the original
//   const originalMesh = meshRef.current;
//   const clonedMesh = originalMesh.clone();
//   clonedMesh.updateMatrixWorld(true);

//   // Clone geometry and apply world transformations
//   const geometry = clonedMesh.geometry.clone();
//   geometry.applyMatrix4(clonedMesh.matrixWorld);

//   // Apply Clipping Planes to Geometry
//   const clippedGeometry = applyClippingPlanes(geometry, planes);

//   // Create a new mesh with the clipped geometry
//   const finalMesh = new THREE.Mesh(clippedGeometry, clonedMesh.material);

//   // Export using STLExporter
//   const exporter = new STLExporter();
//   const stlString = exporter.parse(finalMesh);

//   // Convert STL to Blob and File
//   const blob = new Blob([stlString], { type: 'application/octet-stream' });
//   const file = new File([blob], `${id}.stl`, { type: 'application/octet-stream' });

//   // Prepare form data
//   const formData = new FormData();
//   formData.append('file', file);

//   await putStlFile(formData);
//   setIsLoading(false);
// };

// const save = async (id: string, planes: THREE.Plane[]) => {
//   setIsLoading(true);
//   messageApi.info('saving..');
//   if (!meshRef.current) {
//     messageApi.error('Mesh reference is not found!');
//     return;
//   }
//   const mesh = meshRef.current;
//   const clippingPlanes = planes;

//   let clippedMesh = mesh;
//   clippingPlanes.forEach((plane) => {
//     const normal = plane.normal;
//     const constant = plane.constant;

//     const size = 1000;
//     const boxGeometry = new THREE.BoxGeometry(size, size, size);
//     const box = new THREE.Mesh(boxGeometry);

//     const position = normal.clone().multiplyScalar(-constant + size / 2);
//     box.position.copy(position);

//     const quaternion = new THREE.Quaternion();
//     quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
//     box.quaternion.copy(quaternion);

//     clippedMesh = CSG.subtract(clippedMesh, box);
//   });
//   clippedMesh.geometry = BufferGeometryUtils.mergeVertices(clippedMesh.geometry);
//   clippedMesh.geometry.computeVertexNormals();
//   clippedMesh.geometry.computeBoundingBox();
//   clippedMesh.geometry.computeBoundingSphere();
//   console.log(clippedMesh.geometry?.attributes?.position?.count); // should be > 0
//   const exporter = new STLExporter();
//   const result = exporter.parse(clippedMesh, { binary: true });
//   const blob = new Blob([result], { type: 'application/octet-stream' }); // or 'application/sla' for STL

//   const formData = new FormData();
//   const name = new Date().toISOString();
//   formData.append('file', blob, `${name}.stl`);
//   await upload(formData, name);
//   const url = URL.createObjectURL(blob);
//   const link = document.createElement('a');
//   link.href = url;
//   link.download = `${name}.stl`;
//   document.body.appendChild(link);
//   link.click();
// };
