import { useState, useEffect } from 'react';
import { STLLoader } from 'three/examples/jsm/Addons.js';
import * as THREE from 'three';
import { axios } from '@/config/axiosConfig';

interface GeometryType {
  url: string;
  geometry: THREE.BufferGeometry;
}

const useSafeStlLoader = (urls: string[]): { geometries: GeometryType[]; isLoading: boolean } => {
  const [geometries, setGeometries] = useState<GeometryType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loader = new STLLoader();

    const loadAll = async () => {
      setIsLoading(true);
      try {
        const loadedGeometries: GeometryType[] = [];

        for (const url of urls) {
          try {
            const textResponse = await axios.get(url, { responseType: 'text' });
            const text = textResponse.data;

            if (text.trim() === 'solid\nendsolid' || text.trim() === 'solid\r\nendsolid') {
              console.warn(`Empty STL — skipping: ${url}`);
              continue;
            }

            const bufferResponse = await axios.get(url, { responseType: 'arraybuffer' });
            const geometry = loader.parse(bufferResponse.data);
            loadedGeometries.push({ url, geometry });
          } catch (err) {
            console.error('Error loading STL:', err);
          }
        }

        setGeometries(loadedGeometries);
      } finally {
        setIsLoading(false);
      }
    };

    loadAll();
  }, [urls]);

  return { geometries, isLoading };
};

export default useSafeStlLoader;
