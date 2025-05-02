import { CaseSurgeonPair } from '@/services/case/case-surgeon.service';
import { useDoctorSelectOptions } from '@/services/doctor/doctor.service';
import { Modal, Select } from 'antd';

interface SurgeonSelectModalProps {
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
  surgeons: CaseSurgeonPair[] | undefined;
  selectedSurgeon?: string;
  setSelectedSurgeon: (id: string) => void;
}

const SurgeonSelectModal = ({
  open,
  onOk,
  onCancel,
  surgeons,
  selectedSurgeon,
  setSelectedSurgeon,
}: SurgeonSelectModalProps) => {
  const { data: options } = useDoctorSelectOptions();
  const doctorSelectOptions = (options || []).map((doc: { firstname: string; lastname: string; id: string }) => ({
    label: `${doc.firstname} ${doc.lastname}`,
    value: doc.id,
    disabled: surgeons?.some((s) => s.doctor_id === doc.id),
  }));

  return (
    <Modal title='Select Additional Surgeon' open={open} onOk={onOk} onCancel={onCancel} okText='Confirm' centered>
      <Select
        options={doctorSelectOptions}
        placeholder='Select surgeon'
        onChange={setSelectedSurgeon}
        value={selectedSurgeon}
        style={{ width: '100%' }}
      />
    </Modal>
  );
};

export default SurgeonSelectModal;
