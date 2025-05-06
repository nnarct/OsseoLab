import { CaseTechnicianPair } from '@/services/case/case-technician.service';
import { useTechnicianSelectOptions } from '@/services/technician/technician.service';
import { Modal, Select } from 'antd';

interface TechnicalSelectModalProps {
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
  technician: CaseTechnicianPair[] | undefined;
  selectedTechnician?: string;
  setSelectedTechnician: (id: string) => void;
}

const TechnicalSelectModal = ({
  open,
  onOk,
  onCancel,
  technician,
  selectedTechnician,
  setSelectedTechnician,
}: TechnicalSelectModalProps) => {
  const { data: options } = useTechnicianSelectOptions();
  const technicianSelectOptions = (options || []).map((doc: { firstname: string; lastname: string; id: string }) => ({
    label: `${doc.firstname} ${doc.lastname}`,
    value: doc.id,
    disabled: technician?.some((s) => s.technician_id === doc.id),
  }));

  return (
    <Modal title='Select Additional Engineer' open={open} onOk={onOk} onCancel={onCancel} okText='Confirm' centered>
      <Select
        options={technicianSelectOptions}
        placeholder='Select engineer'
        onChange={setSelectedTechnician}
        value={selectedTechnician}
        style={{ width: '100%' }}
      />
    </Modal>
  );
};

export default TechnicalSelectModal;
