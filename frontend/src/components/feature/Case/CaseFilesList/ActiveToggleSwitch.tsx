import { Switch, message } from 'antd';
import { axios } from '@/config/axiosConfig';
import { invalidateCaseQueries } from './invalidateCaseQueries';

type ActiveToggleSwitchProps = {
  active: boolean;
  caseFileId: string;
  caseId: string;
};

const ActiveToggleSwitch = ({ active, caseFileId, caseId }: ActiveToggleSwitchProps) => {
  const [messageApi, contextHolder] = message.useMessage();

  const toggleActive = async () => {
    try {
      await axios.patch(`/case-file/${caseFileId}/toggle-active`);
      messageApi.success(`File ${active ? 'deactivated' : 'activated'}`);
      invalidateCaseQueries(caseId);
    } catch (error) {
      console.error(error);
      messageApi.error('Failed to update status');
    }
  };

  return (
    <>
      {contextHolder}
      <Switch checked={active} onChange={toggleActive} />
    </>
  );
};

export default ActiveToggleSwitch;
