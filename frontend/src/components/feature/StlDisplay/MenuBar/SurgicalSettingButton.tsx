import { useStlModel } from '@/hooks/useStlModel';
import { Button, Radio } from 'antd';
import { useState } from 'react';
import { IoSettingsOutline } from 'react-icons/io5';
import SurgicalSettingModal from '../Controllers/SurgicalSettingModal';
import { useParams } from 'react-router-dom';

const SurgicalSettingButton = () => {
  const { caseId } = useParams();
  const { isPreSur, setIsPreSur } = useStlModel();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };

  if (!caseId) {
    return null;
  }

  return (
    <>
      <div className='relative'>
        <Button icon={<IoSettingsOutline size={18} />} shape='circle' className='mr-3' onClick={openModal} />
        <Radio.Group
          value={isPreSur}
          optionType='button'
          buttonStyle='solid'
          onChange={(e) => setIsPreSur(e.target.value)}
          options={[
            { value: true, label: 'Pre Surgery   ' },
            { value: false, label: `Post Surgery` },
          ]}
        />
      </div>
      <SurgicalSettingModal caseId={caseId} isOpen={isOpen} closeModal={closeModal} openModal={openModal} />
    </>
  );
};

export default SurgicalSettingButton;
