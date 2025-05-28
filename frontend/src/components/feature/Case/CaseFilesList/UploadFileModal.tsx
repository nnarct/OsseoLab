import { useState } from 'react';
import { Button, Form, Input, Modal, Upload, message } from 'antd';
import { TiUploadOutline } from 'react-icons/ti';
import { uploadCaseFile } from '@/api/case-file.api';
import { invalidateCaseQueries } from './invalidateCaseQueries';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  caseId: string;
};

const UploadFileModal = ({ isOpen, onClose, caseId }: Props) => {
  const [form] = Form.useForm();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleSubmit = async (values: { nickname: string }) => {
    const nickname = values.nickname.trim();
    if (!nickname) {
      messageApi.error('Please enter a nickname for the file!');
      return;
    }
    if (!file) {
      messageApi.error('Please select an STL file!');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('nickname', nickname);
    formData.append('case_id', caseId);

    try {
      setLoading(true);
      await uploadCaseFile(formData);
      messageApi.success(`File "${nickname}" uploaded successfully!`);
      setFile(null);
      form.resetFields();
      invalidateCaseQueries(caseId);
      onClose();
    } catch (error) {
      messageApi.error('Upload failed!');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onCancel = () => {
    setFile(null);
    form.resetFields();
    onClose();
  };

  return (
    <>
      {contextHolder}
      <Modal centered footer={null} open={isOpen} destroyOnClose onCancel={onCancel} title='Upload STL File'>
        <Form form={form} onFinish={handleSubmit} requiredMark='optional' disabled={loading}>
          <Form.Item name='nickname' label='File name' rules={[{ required: true, message: 'Please enter file name.' }]}>
            <Input placeholder='Enter file name' />
          </Form.Item>
          <Form.Item label='Select STL File' name={'stl'} rules={[{ required: true, message: 'Please Upload file.' }]}>
            <Upload
              beforeUpload={(file) => {
                setFile(file);
                return false;
              }}
              maxCount={1}
              accept='.stl'
            >
              <Button icon={<TiUploadOutline />}>Upload STL File</Button>
            </Upload>
          </Form.Item>
          <div className='flex justify-center gap-6'>
            <Button onClick={onClose}>Cancel</Button>
            <Button type='primary' htmlType='submit' loading={loading}>
              Submit
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default UploadFileModal;
