import { Modal } from 'antd';
import { useState } from 'react';
import MenuButton from './MenuButton';
import { PiFloppyDiskBackDuotone } from 'react-icons/pi';

const SaveButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClick = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <MenuButton icon={<PiFloppyDiskBackDuotone />} onClick={handleClick} tooltip='Save Model' text='Save' />
      <Modal
        open={isOpen}
        onOk={() => setIsOpen(false)}
        onCancel={() => setIsOpen(false)}
        title='Save Unavailable'
        okText='OK'
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        <p>We apologize, but saving the model is currently unavailable.</p>
        <p>Please try again later or contact support if the issue persists.</p>
      </Modal>
    </>
  );
};

export default SaveButton;
