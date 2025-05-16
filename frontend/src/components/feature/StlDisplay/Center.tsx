import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import Controllers from './Controllers/Controllers';
import Model from './Model';
import { useStlDisplay } from '@/hooks/useStlDisplay';
import MenuBar from './MenuBar/MenuBar';
import { Suspense, useEffect } from 'react';
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
import { PlaneDataType } from '@/types/stlDisplay';

const Center = ({ urls }: { urls: string[] }) => {
  // console.log('Center/>');
  const location = useLocation();
  const [messageApi, contextHolder] = message.useMessage();
  const { caseNumber } = location.state;
  const {
    angleHandler,
    resetModel,
    measureHandler,
    planeHandler: { getPlanes },
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
    const payload = {
      planes: planes.map((p) => {
        const origin = new THREE.Vector3();
        const normal = new THREE.Vector3(0, 0, 1);
        console.log(`Plane ${p.number} normal:`, normal.toArray());
        if (p.meshRef?.current) {
          p.meshRef.current.getWorldPosition(origin);
          normal.applyQuaternion(p.meshRef.current.quaternion).normalize();
        }

        const constant = -normal.dot(origin);

        return {
          name: `Plane_${p.number}`,
          origin: {
            x: origin.x,
            y: origin.y,
            z: origin.z,
          },
          normal: {
            x: normal.x,
            y: normal.y,
            z: normal.z,
          },
          constant: constant,
        };
      }),
      tokens,
    };

    if (payload.planes.length === 2) {
      const n0 = payload.planes[0].normal;
      const n1 = payload.planes[1].normal;
      const v0 = new THREE.Vector3(n0.x, n0.y, n0.z).normalize();
      const v1 = new THREE.Vector3(n1.x, n1.y, n1.z).normalize();
      const dot = v0.dot(v1);
      console.log(`[DOT FRONTEND] Plane 0 normal:`, v0.toArray(), `Plane 1 normal:`, v1.toArray(), `Dot product:`, dot);
    }

    console.log({ payload: payload.planes });
    // return;
    try {
      const response = await axios.post('/cutting-plane/save-multiple', payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log('Saved cutting planes:', response.data);
      messageApi.success(`Saved cutting planes. ${response.data.results[0]?.cut_method}`);
      const data = response.data as ResponseType;
      const results = data.results;
      navigate(`/case/${caseId}/file/${results[0].new_version.case_file_id}`, {
        state: { caseNumber, urls: data.urls, filename: results[0].new_version.filename },
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

  // console.log({ urls });
  return (
    <>
      {contextHolder}
      <MenuBar onSave={save} />

      <Canvas style={{ width: 'auto', height: '100%', background: '#f7f7f7', marginInline: 'auto' }}>
        {/* <Canvas style={{ width: '50vw', height: '50vh', background: '#f7f7f7', marginInline: 'auto' }}> */}
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
  results: {
    url: string;
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
  }[];
}
