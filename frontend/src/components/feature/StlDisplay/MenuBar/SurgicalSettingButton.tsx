import { useStlModel } from '@/hooks/useStlModel';
import { Button, Radio } from 'antd';
import { useState } from 'react';
import { IoSettingsOutline } from 'react-icons/io5';
import SurgicalSettingModal from '../Controllers/SurgicalSettingModal';
import { useParams } from 'react-router-dom';

const SurgicalSettingButton = () => {
  const { caseId } = useParams();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { currentSurgicalType, setCurrentSurgicalType } = useStlModel();
  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };

  // updateMeshVisibility;

  // const onSetSurgical = async () => {
  //   const response = await axios.get(`/case-files/${caseId}/active`);
  //   const tempCaseFiles = response.data as CaseFile[];

  //   tempCaseFiles.forEach((cf, i) => {
  //     if (isPreSur === 'pre') {
  //       updateMeshVisibility(i, cf.pre);
  //     } else if (isPreSur === 'post') {
  //       updateMeshVisibility(i, cf.post);
  //     }
  //   });

  //   setCaseFiles(tempCaseFiles);
  // };

  // const onLocalSetSurgical = async (value: 'pre' | 'post') => {
  //   setIsPreSur(value);
  //   caseFiles.forEach((cf, i) => {
  //     if (value === 'pre') {
  //       updateMeshVisibility(i, cf.pre);
  //     } else if (value === 'post') {
  //       updateMeshVisibility(i, cf.post);
  //     }
  //   });
  // };

  if (caseId) {
    return (
      <>
        <div className='relative'>
          <Button icon={<IoSettingsOutline size={18} />} shape='circle' className='mr-3' onClick={openModal} />
          <Radio.Group
            value={currentSurgicalType}
            optionType='button'
            buttonStyle='solid'
            onChange={(e) => setCurrentSurgicalType(e.target.value)}
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
          onUpdate={async () => {}}
          // onUpdate={async () => await onSetSurgical()}
        />
      </>
    );
  }
};

export default SurgicalSettingButton;
