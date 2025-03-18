import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import Controllers from './Controllers';
import Model from './Model';
import ClippingPlane from './ClippingPlane';
import { useStlDisplay } from '@/hooks/useStlDisplay';
import MenuBar from './MenuBar';
import { useEffect, useRef } from 'react';
import { STLExporter } from 'three/examples/jsm/Addons.js';
import { axios } from '@/config/axiosConfig';

const Center = ({ url, id }: { url: string; id: string }) => {
  const { planes, resetModel } = useStlDisplay();
  const meshRef = useRef<THREE.Mesh>(null);
  useEffect(() => {
    resetModel();
  }, [url]); // eslint-disable-line react-hooks/exhaustive-deps

  const save = async (id: string) => {
    if (!meshRef.current) {
      console.error("No mesh available to save.");
      return;
    }
  
    console.log("Exporting...");
  
    // Clone the mesh so we don’t modify the original
    const clonedMesh = meshRef.current.clone();
    clonedMesh.updateMatrixWorld(true);
  
    // Clone the geometry and apply world transformations
    const geometry = clonedMesh.geometry.clone();
    geometry.applyMatrix4(clonedMesh.matrixWorld);
  
    // Create a temporary mesh with the transformed geometry
    const tempMesh = new THREE.Mesh(geometry, clonedMesh.material);
  
    // Export using STLExporter
    const exporter = new STLExporter();
    const stlString = exporter.parse(tempMesh);
    // Convert STL to Blob and File
    const blob = new Blob([stlString], { type: "application/octet-stream" });
    const file = new File([blob], `${id}.stl`, { type: "application/octet-stream" });
  
    // Prepare form data
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const response = await axios.put(`/stl/file/${id}`, formData);
      console.log("File updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating STL file:", error);
    }
  };
  
  return (
    <>
      <MenuBar onSave={() => save(id)} />
      <Canvas style={{ height: '80vh', maxWidth: '80vh', width: 'auto', background: 'black', marginInline: 'auto' }}>
        <Controllers />
        <Model url={url} meshRef={meshRef} />
        {planes.map((planeObj) => (
          <ClippingPlane key={planeObj.id} {...planeObj} />
        ))}
      </Canvas>
    </>
  );
};

export default Center;
