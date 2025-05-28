import { Checkbox, message } from 'antd';
import { axios } from '@/config/axiosConfig';
import { invalidateCaseQueries } from './invalidateCaseQueries';

type TagCheckboxProps = {
  nickname: string;
  checked: boolean;
  caseFileId: string;
  field: 'pre' | 'post';
  caseId: string;
};

const TagCheckbox = ({ nickname, checked, caseFileId, field, caseId }: TagCheckboxProps) => {
  const [messageApi, contextHolder] = message.useMessage();

  return (
    <>
      {contextHolder}
      <Checkbox
        checked={checked}
        onChange={async (e) => {
          try {
            await axios.patch(`/surgery_display/case-file/${caseFileId}/tag`, {
              [field]: e.target.checked,
            });
            messageApi.success(
              `Marked ${nickname} as ${e.target.checked ? `${field[0].toUpperCase() + field.slice(1)}-surgical` : `Not ${field[0].toUpperCase() + field.slice(1)}-surgical`}`
            );
            invalidateCaseQueries(caseId);
          } catch {
            messageApi.error(`Failed to update ${field}-surgical tag`);
          }
        }}
      />
    </>
  );
};

export default TagCheckbox;
