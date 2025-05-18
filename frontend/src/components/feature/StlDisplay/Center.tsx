import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import Controllers from './Controllers/Controllers';
import Model from './Model';
import { useStlDisplay } from '@/hooks/useStlDisplay';
import MenuBar from './MenuBar/MenuBar';
import { Suspense, useEffect, useState } from 'react';
import SceneSetter from './SceneSetter';

import { MeasureTool } from './MeasureTool/MeasureTool';
import AngleTool from './AngleTool/AngleTool';
import MeasureLineGroup from './MeasureTool/MeasureLineGroup';
import AngleLineGroup from './AngleTool/AngleLineGroup';
import ClippingPlaneList from './ClippingPlane/ClippingPlaneList';
import Loader from './Loader';
import { axios } from '@/config/axiosConfig';
import { Button, message } from 'antd';
import { PlaneDataType } from '@/types/stlDisplay';
import { StlModelProvider } from '@/context/StlModelContext';
import { useParams } from 'react-router-dom';
import queryClient from '@/config/queryClient';
import { MessageInstance } from 'antd/es/message/interface';
import { CaseModelById } from '@/api/files.api';
import { useStlModel } from '@/hooks/useStlModel';
const Center = ({ files }: { files: CaseModelById[] }) => {
  // console.log('Center/>');

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
  const urls = files.map((i) => i.url);
  const names = files.map((i) => i.name);
  const save = async () => {
    const planes: PlaneDataType[] = getPlanes();
    await saveModel(urls, planes, messageApi, caseId);
  };
  useEffect(() => {
    resetModel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <StlModelProvider>
        {contextHolder}
        <MenuBar onSave={save} />
        <Button onClick={() => toggle(0)}>0</Button>
        <Button onClick={() => toggle(1)}>1</Button>
        <div
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: 'calc( 100vh - 188px )',
          }}
        >
          <Canvas style={{ flex: 1, background: '#f7f7f7' }}>
            {/* <Canvas style={{ width: '50vw', height: '50vh', background: '#f7f7f7', marginInline: 'auto' }}> */}
            <Suspense fallback={<Loader />}>
              <SceneSetter />
              <Controllers />
              <Model urls={urls} names={names} />

              {/* <Angle/> */}
              <ClippingPlaneList />
              {isAngleActive && <AngleTool />}
              {isMeasureActive && <MeasureTool />}
              <MeasureLineGroup />
              <AngleLineGroup />
            </Suspense>
          </Canvas>
        </div>
      </StlModelProvider>
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
  caseId: string | undefined
) => {
  const tokens = urls.map((url) => {
    const parts = url.split('/');
    return parts[parts.length - 1];
  });
  // const planes: PlaneDataType[] = getPlanes();

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

  if (payload.planes.length === 2) {
    // const [p0, p1] = payload.planes;
    // const origin0 = new THREE.Vector3(p0.origin.x, p0.origin.y, p0.origin.z);
    // const origin1 = new THREE.Vector3(p1.origin.x, p1.origin.y, p1.origin.z);
    // const normal0 = new THREE.Vector3(p0.normal.x, p0.normal.y, p0.normal.z).normalize();
    // const normal1 = new THREE.Vector3(p1.normal.x, p1.normal.y, p1.normal.z).normalize();
    // const direction01 = origin1.clone().sub(origin0).normalize();
    // const direction10 = origin0.clone().sub(origin1).normalize();
    // const facing0 = normal0.dot(direction01); // > 0 means Plane 0 faces Plane 1
    // const facing1 = normal1.dot(direction10); // > 0 means Plane 1 faces Plane 0
    // const areFacingEachOther = facing0 > 0 && facing1 > 0;
    // console.log(`[FACING CHECK] Plane 0 facing 1:`, facing0, `Plane 1 facing 0:`, facing1);
    // console.log('Planes facing each other:', areFacingEachOther);
  }

  // console.log({ payload: payload.planes });
  // return;
  try {
    const response = await axios.post('/cutting-plane/save-multiple', payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    // console.log('Saved cutting planes:', response.data);
    const data = response.data as ResponseType;
    if (data.results.length > 0) {
      // const results = data.results;
      // messageApi.success(`Saved cutting planes. ${response.data.results[0]?.cut_method}`);
      messageApi.success(`Anatomical structure was successfully segmented`);
      console.log({ response });
      queryClient.invalidateQueries({ queryKey: ['caseFilesByCaseId', caseId] });
      // navigate(`/case/${caseId}/file`);
    } else {
      messageApi.success(`No changes were applied to the anatomical model`);
    }
    // clearPlane()
  } catch (err) {
    console.error('Failed to save cutting planes:', err);
    messageApi.error('Failed to save cutting planes');
  }
  // finally{    navigate(-1)}
};
