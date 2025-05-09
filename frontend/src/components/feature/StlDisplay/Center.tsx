import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import Controllers from './Controllers/Controllers';
import Model from './Model';
import { useStlDisplay } from '@/hooks/useStlDisplay';
import MenuBar from './MenuBar/MenuBar';
import { Suspense, useEffect, useRef, useState } from 'react';
import SceneSetter from './SceneSetter';

import { MeasureTool } from './MeasureTool/MeasureTool';
import AngleTool from './AngleTool/AngleTool';
import MeasureLineGroup from './MeasureTool/MeasureLineGroup';
import AngleLineGroup from './AngleTool/AngleLineGroup';
import ClippingPlaneList from './ClippingPlane/ClippingPlaneList';
import Loader from './Loader';
import { axios } from '@/config/axiosConfig';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { message } from 'antd';
import { modelDirection } from 'three/src/nodes/TSL.js';

export interface PlaneDataType {
  id: string;
  plane: THREE.Plane;
  position: THREE.Vector3;
  mode: THREE.TransformControlsMode;
  frontColor: string;
  backColor: string;
  opacity: number;
  show: boolean;
  number: number;
}

const Center = ({ urls }: { urls: string[] }) => {
  console.log('render <Center/>');
  const [messageApi, contextHolder] = message.useMessage();
  const location = useLocation();
  const {
    angleHandler,
    resetModel,
    measureHandler,
    planeHandler: { getPlanes, clear: clearPlane },
  } = useStlDisplay();
  const { isActive: isMeasureActive } = measureHandler;
  const { isActive: isAngleActive } = angleHandler;
  const navigate = useNavigate();
  const { caseId } = useParams();
  const save = async () => {
    const tokens = urls.map((url) => {
      const parts = url.split('/');
      return parts[parts.length - 1];
    });
    const planes: PlaneDataType[] = getPlanes();

    if (!planes.length || !urls.length) return;

    const rotation = new THREE.Euler(-Math.PI / 2, 0, 0);
    const matrix = new THREE.Matrix4().makeRotationFromEuler(rotation);
    const payload = {
      planes: planes.map((p) => {
        console.log({ position: p.position, normal: p.plane.normal });
        const positionVec = new THREE.Vector3(p.position.x, p.position.y, p.position.z);
        const normalVec = new THREE.Vector3(p.plane.normal.x, p.plane.normal.y, p.plane.normal.z);

        const rotatedPosition = positionVec.clone().applyMatrix4(matrix);
        if (Math.abs(rotatedPosition.x) < 1e-6) rotatedPosition.x = 0;
        if (Math.abs(rotatedPosition.y) < 1e-6) rotatedPosition.y = 0;
        if (Math.abs(rotatedPosition.z) < 1e-6) rotatedPosition.z = 0;
        const rotatedNormal = normalVec.clone().applyMatrix4(matrix).normalize();
        if (Math.abs(rotatedNormal.x) < 1e-6) rotatedNormal.x = 0;
        if (Math.abs(rotatedNormal.y) < 1e-6) rotatedNormal.y = 0;
        if (Math.abs(rotatedNormal.z) < 1e-6) rotatedNormal.z = 0;

        return {
          name: `Plane_${p.number}`,
          position: {
            x: rotatedPosition.x,
            y: rotatedPosition.y,
            z: rotatedPosition.z,
          },
          normal: {
            x: rotatedNormal.x,
            y: rotatedNormal.y,
            z: rotatedNormal.z,
          },
        };
      }),
      tokens,
    };
    // console.log({ payload:payload.planes });
    // return;
    try {
      const response = await axios.post('/cutting-plane/save-multiple', payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log('Saved cutting planes:', response.data);
      messageApi.success('Saved cutting planes.');
      const data = response.data.results[0] as ResponseType;
      navigate(`/case/${caseId}/file/${data.new_version.case_file_id}`, {
        state: { urls: data.urls, filename: data.new_version.filename },
      });
      // clearPlane()
    } catch (err) {
      console.error('Failed to save cutting planes:', err);
      messageApi.error('Failed to save cutting planes');
    }
    // finally{    navigate(-1)}
  };

  useEffect(() => {
    resetModel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log({ urls });
  return (
    <>
      {contextHolder}
      <MenuBar onSave={save} />

      {/* <Canvas style={{ width: 'auto', height: '100%', background: '#f7f7f7', marginInline: 'auto' }}> */}
      <Canvas style={{ width: '50vw', height: '50vh', background: '#f7f7f7', marginInline: 'auto' }}>
        <Suspense fallback={<Loader />}>
          <SceneSetter />
          <Controllers />
          <Model urls={urls} />

          {/* <Angle/> */}
          <ClippingPlaneList />
          {isAngleActive && <AngleTool />}
          {isMeasureActive && <MeasureTool />}
          <MeasureLineGroup />
          <AngleLineGroup />
        </Suspense>
      </Canvas>
    </>
  );
};

export default Center;

//response is array of interface below
interface ResponseType {
  urls: string[];
  new_version: {
    case_file_id: 'b8a55069-dcb0-40ab-b11a-1c22b559c2a1';
    file_path:
      | '/app/uploads/case_files/2d76b730-686f-4bf1-b630-cbb2de5b9433/mand_20241120_034514_20250205_010047_v2_v3.stl'
      | string;
    filename: 'mand_20241120_034514_20250205_010047_v2_v3.stl' | string;
    filesize: 16689035 | number;
    filetype: 'application/sla';
    id: 'e8d0f8c2-c6b8-4bf4-87ba-129f30c56b9e' | string;
    nickname: 'Maxilla' | string;
    uploaded_at: 1746789078 | number;
    uploaded_by: '43405074-904d-4444-b7b3-e07bb786ba82' | string;
    version_number: number;
  };
  plane: {
    created_at: number | null;
    id: 'None' | string;
    is_visible: boolean;
    name: 'Plane_1' | string;
    normal: {
      x: 0 | number;
      y: 1 | number;
      z: 0 | number;
    };
    original_version_id: '11ffa491-f91b-439f-b56f-88a871cce191' | string;
    position: {
      x: -10.129017191688243 | number;
      y: -27.707872882296595 | number;
      z: 35.65690703013793 | number;
    };
    resulting_version_id: string | 'e8d0f8c2-c6b8-4bf4-87ba-129f30c56b9e';
    updated_at: null | number;
  };
}
