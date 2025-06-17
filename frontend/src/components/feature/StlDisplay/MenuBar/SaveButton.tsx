import { Modal } from 'antd';

import MenuButton from './MenuButton';
import { PiFloppyDiskBackDuotone } from 'react-icons/pi';
import { useStlDisplay } from '@/hooks/useStlDisplay';

const { confirm } = Modal;
interface SaveButtonProps {
  onClick: () => Promise<void>;
}

const SaveButton = ({ onClick }: SaveButtonProps) => {
  const showConfirmModal = () => {
    confirm({
      title: 'Confirm Save',
      content: (
        <div className='rounded-md bg-[#fffbe6] p-3'>
          Saving the model will apply all cutting planes currently in the canvas to every model (including hidden ones).
          <p> Are you sure you want to proceed?</p>
        </div>
      ),
      okText: 'Save',
      cancelText: 'Cancel',
      centered: true,
      okButtonProps: {
        type: 'primary',
        style: { backgroundColor: '#046759', borderColor: '#498c7d' },
      },
      onOk() {
        return onClick().catch((error) => {
          console.error(error);
        });
      },
    });
  };

  const {
    planeHandler: { getPlanes },
  } = useStlDisplay();
  const planes = getPlanes();
  return (
    <>
      <MenuButton
        icon={<PiFloppyDiskBackDuotone />}
        onClick={showConfirmModal}
        tooltip='Save Model'
        text='Save'
        disabled={planes.length === 0}
      />
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
