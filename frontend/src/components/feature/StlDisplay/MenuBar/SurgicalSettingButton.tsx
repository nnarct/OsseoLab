import { useStlModel } from '@/hooks/useStlModel';
import { Button, Radio } from 'antd';
import { useEffect, useState } from 'react';
import { IoSettingsOutline } from 'react-icons/io5';
import SurgicalSettingModal from '../Controllers/SurgicalSettingModal';
import { useParams } from 'react-router-dom';
import { axios } from '@/config/axiosConfig';

type CaseFile = {
  id: string;
  name: string;
  pre: boolean;
  post: boolean;
};
const SurgicalSettingButton = () => {
  const { caseId } = useParams();
  const [isPreSur, setIsPreSur] = useState<'pre' | 'post'>('pre');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [caseFiles, setCaseFiles] = useState<CaseFile[]>([]);
  const { updateMeshVisibility } = useStlModel();
  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const fetchCaseFiles = async () => {
      try {
        const response = await axios.get(`/case-files/${caseId}/active`);
        console.log({ response });
        setCaseFiles(response.data);
        // const caseModels = response.data as CaseFile[];
        // caseModels.forEach((cf, i) => {
        //   if (isPreSur === 'pre') {
        //     updateMeshVisibility(i, cf.pre);
        //   } else if (isPreSur === 'post') {
        //     updateMeshVisibility(i, cf.post);
        //   }
        // });
      } catch (err) {
        console.error('Failed to fetch case files:', err);
      }
    };

    if (caseId) {
      fetchCaseFiles();
    }
  }, [caseId, isOpen, isPreSur, setCaseFiles, updateMeshVisibility]);
  if (!caseId) {
    return null;
  }

  // updateMeshVisibility;

  const onSetSurgical = async () => {
    const response = await axios.get(`/case-files/${caseId}/active`);
    const tempCaseFiles = response.data as CaseFile[];

    tempCaseFiles.forEach((cf, i) => {
      if (isPreSur === 'pre') {
        updateMeshVisibility(i, cf.pre);
      } else if (isPreSur === 'post') {
        updateMeshVisibility(i, cf.post);
      }
    });
    setCaseFiles(tempCaseFiles);
  };
  const onLocalSetSurgical = async (value: 'pre' | 'post') => {
    setIsPreSur(value);
    caseFiles.forEach((cf, i) => {
      if (value === 'pre') {
        updateMeshVisibility(i, cf.pre);
      } else if (value === 'post') {
        updateMeshVisibility(i, cf.post);
      }
    });
  };

  return (
    <>
      <div className='relative'>
        <Button icon={<IoSettingsOutline size={18} />} shape='circle' className='mr-3' onClick={openModal} />
        <Radio.Group
          value={isPreSur}
          optionType='button'
          buttonStyle='solid'
          onChange={(e) => onLocalSetSurgical(e.target.value)}
          options={[
            { value: 'pre', label: 'Pre Surgery' },
            { value: 'post', label: `Post Surgery` },
          ]}
        />
      </div>
      <SurgicalSettingModal
        caseId={caseId}
        isOpen={isOpen}
        closeModal={closeModal}
        openModal={openModal}
        caseFiles={caseFiles}
        setCaseFiles={setCaseFiles}
        onUpdate={async () => await onSetSurgical()}
      />
    </>
  );
};

export default SurgicalSettingButton;
