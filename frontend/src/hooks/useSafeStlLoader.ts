import { useState, useEffect } from 'react';
import { STLLoader } from 'three/examples/jsm/Addons.js';
import * as THREE from 'three';
const useSafeStlLoader = (urls: string[]): THREE.BufferGeometry[] => {
  const [geometries, setGeometries] = useState<THREE.BufferGeometry[]>([]);

  useEffect(() => {
    const loader = new STLLoader();

    const loadAll = async () => {
      const loadedGeometries: THREE.BufferGeometry[] = [];

      for (const url of urls) {
        try {
          const text = await fetch(url).then((res) => res.text());

          if (text.trim() === 'solid\nendsolid' || text.trim() === 'solid\r\nendsolid') {
            console.warn(`Empty STL — skipping: ${url}`);
            continue;
          }

          const buffer = await fetch(url).then((res) => res.arrayBuffer());
          const geometry = loader.parse(buffer);
          loadedGeometries.push(geometry);
        } catch (err) {
          console.error('Error loading STL:', err);
        }
      }

      setGeometries(loadedGeometries);
    };

    loadAll();
  }, [urls]);

  return geometries;
};

export default useSafeStlLoader;
