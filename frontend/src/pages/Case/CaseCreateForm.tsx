import { Form, Input, Button, DatePicker, Select, message, Card, Layout, Switch, Upload, UploadFile } from 'antd';
import { axios } from '@/config/axiosConfig';
import { useState } from 'react';
import dayjs from 'dayjs';
import CustomHeader from '@/components/common/CustomHeader';
import { useNavigate } from 'react-router-dom';
import { useDoctorSelectOptions } from '@/services/doctor/doctor.service';
import type { DoctorSelectOption } from '@/types/doctor';
import { PRODUCTS } from '@/constants/option';
import { AiOutlineInbox } from 'react-icons/ai';

const { TextArea } = Input;

const CaseCreateForm = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  // const [useAgeInput, setUseAgeInput] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();
  const { data: surgeons } = useDoctorSelectOptions();
  const [useDobInput, setUseDobInput] = useState(true);

  const surgeonOptions = (surgeons || []).map((doc: DoctorSelectOption) => ({
    label: `${doc.firstname} ${doc.lastname}`,
    value: doc.id,
  }));
  const [isOtherProduct, setIsOtherProduct] = useState<boolean>(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (useDobInput && values.patient_dob) {
        values.patient_dob = dayjs(values.patient_dob).hour(12).minute(0).second(0).toISOString();
      } else if (values.patient_age) {
        values.patient_dob = dayjs().subtract(Number(values.patient_age), 'year').format('YYYY-MM-DD');
      }

      const formData = new FormData();
      Object.entries({
        ...values,
        surgery_date: values.surgery_date
          ? dayjs(values.surgery_date).hour(12).minute(0).second(0).toISOString()
          : null,
        anticipated_ship_date: values.anticipated_ship_date
          ? dayjs(values.anticipated_ship_date).hour(12).minute(0).second(0).toISOString()
          : null,
      }).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      fileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append('files', file.originFileObj);
        }
      });

      await axios.post('/case/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      messageApi.success('Case created successfully');
      navigate('/case/list');
    } catch (error) {
      messageApi.error('Failed to create case');
      console.error(error);
    }
  };

  return (
    <>
      {contextHolder}
      <CustomHeader backTo={-1}>
        <h1 className='text-2xl font-bold'>Create New Case</h1>
      </CustomHeader>
      <Layout.Content className='p-4'>
        <Card title='Case Information'>
          <Form form={form} layout='vertical' onFinish={handleSubmit} className='grid grid-cols-2 gap-x-4'>
            <Form.Item name='surgeon_id' label='Surgeon' rules={[{ required: true }]}>
              <Select placeholder='Select a surgeon' options={surgeonOptions} />
            </Form.Item>
            <Form.Item style={{ marginBottom: 0 }}>
              <Form.Item name='product' label='Product'>
                <Select
                  showSearch
                  placeholder='Product / Service'
                  options={[{ label: 'Other', value: 'Other' }, ...PRODUCTS]}
                  allowClear
                  onChange={(value) => setIsOtherProduct(value === 'Other')}
                />
              </Form.Item>

              {isOtherProduct && (
                <Form.Item name='other_product' label='Other Product' rules={[{ required: isOtherProduct }]}>
                  <Input placeholder='Other product' allowClear />
                </Form.Item>
              )}
            </Form.Item>
            <Form.Item label='Patient Name' name='patient_name' rules={[{ required: true }]}>
              <Input placeholder='Enter patient name' />
            </Form.Item>
            <Form.Item
              style={{ margin: '0' }}
              label={
                <div className='flex items-center gap-x-2'>
                  Patient Age
                  <Switch size='small' checked={useDobInput} onChange={(checked) => setUseDobInput(checked)} />
                  Date of Birth
                </div>
              }
            >
              {useDobInput ? (
                <Form.Item name='patient_dob'>
                  <DatePicker className='w-full' placeholder='Select patient DOB' format='DD-MM-YYYY' />
                </Form.Item>
              ) : (
                <Form.Item name='patient_age'>
                  <Input type='number' min={0} placeholder='Enter patient age' allowClear />
                </Form.Item>
              )}
            </Form.Item>{' '}
            <Form.Item label='Patient Gender' name='patient_gender'>
              <Select
                placeholder='Select Patient gender'
                options={[
                  { label: 'Female', value: 'female' },
                  { label: 'Male', value: 'male' },
                  { label: 'Other', value: 'other' },
                ]}
              />
            </Form.Item>
            <Form.Item label='Surgery Date' name='surgery_date' rules={[{ required: true }]}>
              <DatePicker className='w-full' placeholder='Select surgery date' format='DD-MM-YYYY' />
            </Form.Item>
            <Form.Item label='Scan Type' name='scan_type'>
              <Select
                placeholder='Scan type'
                options={[
                  { label: 'MRI', value: 'MRI' },
                  { label: 'CT', value: 'CT' },
                ]}
                allowClear
              />
            </Form.Item>
            {/* <Form.Item label='Priority' name='priority'>
              <Select
                placeholder={'Select priority'}
                options={[
                  { label: 'Low', value: 'low' },
                  { label: 'Medium', value: 'medium' },
                  { label: 'High', value: 'high' },
                ]}
              />
            </Form.Item>{' '} */}
            <Form.Item label='Status' name='status'>
              <Select
                placeholder={'Select status'}
                options={[
                  { label: 'Case creation', value: 'creation' },
                  { label: 'Planning & Design', value: 'planing' },
                  { label: 'Device Design', value: 'device-design' },
                  { label: 'Design Confirmation', value: 'design-confirmation' },
                  // { label: 'Case Complete', value: 'complete' },
                ]}
              />
            </Form.Item>
            <Form.Item name='problem_description' label='Problem Description'>
              <TextArea rows={3} placeholder='Describe the patient problem' allowClear />
            </Form.Item>
            <Form.Item name='additional_note' label='Additional Note'>
              <TextArea rows={3} placeholder='Enter any additional notes' allowClear />
            </Form.Item>{' '}
            {/* <Form.Item label='Anticipated ship date' name='anticipated_ship_date'>
              <DatePicker className='w-full' placeholder='Select Anticipated ship date' format='DD-MM-YYYY' />
            </Form.Item> */}
            <Form.Item
              name='files'
              label={`Upload Files ${fileList.length > 0 ? `(${fileList.length})` : ''}`}
              className='col-span-2'
            >
              <Upload.Dragger
                multiple
                fileList={fileList}
                beforeUpload={() => false}
                onChange={({ fileList }) => setFileList(fileList)}
                accept='.stl,.jpg,.jpeg,.png,.pdf,.zip'
              >
                <p className='flex justify-center pb-2 text-2xl'>
                  <AiOutlineInbox />
                </p>
                {/* <p className='ant-upload-text'>Click or drag files to upload (STL, images, PDF, ZIP)</p> */}
                <p className='ant-upload-text'>Click or drag files to upload (STL)</p>
              </Upload.Dragger>
            </Form.Item>
            <div className='col-span-2 flex items-center justify-center gap-x-4'>
              <Button onClick={() => navigate('/case/list')} className='w-22' size='middle'>
                Cancel
              </Button>
              <Button type='primary' htmlType='submit' className='w-22' size='middle'>
                Confirm
              </Button>
            </div>
          </Form>
        </Card>
      </Layout.Content>
    </>
  );
};

export default CaseCreateForm;
