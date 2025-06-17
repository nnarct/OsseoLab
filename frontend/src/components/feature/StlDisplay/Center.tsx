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
import { message } from 'antd';
import { PlaneDataType } from '@/types/stlDisplay';
import { NavigateFunction, useNavigate, useParams } from 'react-router-dom';
import type { MessageInstance } from 'antd/es/message/interface';
import { invalidateCaseQueries } from '../Case/CaseFilesList/invalidateCaseQueries';
import type { CaseModelById } from '@/api/files.api';

const Center = ({ files }: { files: CaseModelById[] }) => {
  const navigate = useNavigate();
  const { caseId } = useParams();
  const [messageApi, contextHolder] = message.useMessage();
  const {
    angleHandler,
    resetModel,
    measureHandler,
    planeHandler: { getPlanes },
  } = useStlDisplay();
  const { isActive: isMeasureActive } = measureHandler;
  const { isActive: isAngleActive } = angleHandler;
  const activeMeshes = files.filter((i) => i.active);

  const save = async () => {
    const planes: PlaneDataType[] = getPlanes();
    const urls = files.filter((i) => i.active).map((i) => i.url);
    if (caseId) {
      await saveModel(urls, planes, messageApi, caseId, navigate);
    }
  };
  useEffect(() => {
    resetModel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {contextHolder}
      <MenuBar onSave={save} />
      <div
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: 'calc( 100vh - 188px )',
        }}
      >
        <Canvas style={{ flex: 1, background: '#f7f7f7' }}>
          <Suspense fallback={<Loader />}>
            <SceneSetter />
            <Controllers />
            <Model activeMeshes={activeMeshes} />

            {/* <Angle/> */}
            <ClippingPlaneList />
            {isAngleActive && <AngleTool />}
            {isMeasureActive && <MeasureTool />}
            <MeasureLineGroup />
            <AngleLineGroup />
          </Suspense>
        </Canvas>
      </div>
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

const saveModel = async (
  urls: string[],
  planes: PlaneDataType[],
  messageApi: MessageInstance,
  caseId: string,
  navigate: NavigateFunction
) => {
  const tokens = urls.map((url) => {
    const parts = url.split('/');
    return parts[parts.length - 1];
  });

  if (!planes.length || !urls.length) return;
  const payload = {
    planes: planes.map((p) => {
      const origin = new THREE.Vector3();
      const normal = new THREE.Vector3(0, 0, 1);
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

  try {
    const response = await axios.post('/cutting-plane/save-multiple', payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const data = response.data as ResponseType;
    if (data.results.length > 0) {
      messageApi.success(`Anatomical structure was successfully segmented`);
      invalidateCaseQueries(caseId);

      navigate(`/case/${caseId}/file`);
    } else {
      messageApi.warning(`No changes were applied to the anatomical model`);
    }
  } catch (err) {
    console.error('Failed to save cutting planes:', err);
    messageApi.error('Failed to save cutting planes');
  }
};
