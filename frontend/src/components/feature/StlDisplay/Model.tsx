import { useEffect, useMemo, useRef } from 'react';
import { useStlModel } from '@/hooks/useStlModel';
import useSafeStlLoader from '@/hooks/useSafeStlLoader';
import type { CaseModelById } from '@/api/files.api';
import MeshComponent from '@/components/feature/StlDisplay/MeshComponent';

interface ModelProps {
  activeMeshes: CaseModelById[];
}

const Model = ({ activeMeshes }: ModelProps) => {
  const previousUrls = useRef<string[]>([]);

  const urls = useMemo(() => {
    const newUrls = activeMeshes.map((mesh) => mesh.url);
    if (
      newUrls.length !== previousUrls.current.length ||
      newUrls.some((url, idx) => url !== previousUrls.current[idx])
    ) {
      previousUrls.current = newUrls;
    }
    return previousUrls.current;
  }, [activeMeshes]);
  const { geometries: loadedGeometries, isLoading } = useSafeStlLoader(urls);
  const { meshes, initializeMeshes, setMeshes } = useStlModel()!;
  useEffect(() => {
    initializeMeshes(loadedGeometries, activeMeshes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadedGeometries]);

  useEffect(() => {
    setMeshes((prevMeshes) => {
      return prevMeshes.map((mesh) => {
        const matched = loadedGeometries.find((g) => g.url === mesh.url);
        if (matched && matched.geometry !== mesh.geometry) {
          const newGeom = matched.geometry.clone();
          return {
            ...mesh,
            geometry: newGeom,
          };
        }
        return mesh;
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadedGeometries]);

  if (!isLoading && (!meshes || meshes.length === 0 || meshes[0].geometry.attributes.position.count === 0)) {
    console.warn('Empty STL loaded — no geometry found');
    return null;
  }


  return (
    <>
      {meshes.map((mesh) => (
        <MeshComponent
          key={mesh.id}
          geometry={mesh.geometry}
          visible={mesh.visible}
          color={mesh.color}
          opacity={mesh.opacity}
          id={mesh.id}
        />
      ))}
    </>
  );
};

export default Model;
