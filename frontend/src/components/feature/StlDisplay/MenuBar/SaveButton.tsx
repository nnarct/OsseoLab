import { message, Modal } from 'antd';
import { useState } from 'react';
import MenuButton from './MenuButton';
import { PiFloppyDiskBackDuotone } from 'react-icons/pi';

interface SaveButtonProps {
  onClick: () => Promise<void>;
}

const SaveButton = ({ onClick }: SaveButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messageApi, context] = message.useMessage();
  const handleClick = () => {
    setIsOpen(true);
  };
  return (
    <>
      {context}
      <MenuButton icon={<PiFloppyDiskBackDuotone />} onClick={handleClick} tooltip='Save Model' text='Save' />
      <Modal
        open={isOpen}
        centered
        onOk={async () => {
          await onClick();
          setIsOpen(false);
        }}
        onCancel={() => setIsOpen(false)}
        title='Confirm Save'
        okText='Save'
        cancelText='Cancel'
      >
        <p>Are you sure you want to save the model?</p>
      </Modal>
      {/* <Modal
        open={isOpen}
        onOk={() => setIsOpen(false)}
        onCancel={() => setIsOpen(false)}
        title='Save Unavailable'
        okText='OK'
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        <p>We apologize, but saving the model is currently unavailable.</p>
        <p>Please try again later or contact support if the issue persists.</p>
      </Modal> */}
    </>
  );
};

export default SaveButton;
