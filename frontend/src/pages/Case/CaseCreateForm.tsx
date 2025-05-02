import { Form, Input, Button, DatePicker, Select, message, Card, Layout, Switch } from 'antd';
import { axios } from '@/config/axiosConfig';
import { useState } from 'react';
import dayjs from 'dayjs';
import CustomHeader from '@/components/common/CustomHeader';
import { useNavigate } from 'react-router-dom';
import { useDoctorSelectOptions } from '@/services/doctor/doctor.service';
import { DoctorSelectOption } from '@/api/doctor.api';

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

  const handleSubmit = async () => {
    try {
      const values = await form.getFieldsValue();

      if (useDobInput && values.patient_dob) {
        values.patient_dob = dayjs(values.patient_dob).hour(12).minute(0).second(0).toISOString();
      } else if (values.patient_ag) {
        values.patient_dob = dayjs().subtract(Number(values.patient_age), 'year').format('YYYY-MM-DD');
      }

      const payload = {
        ...values,
        surgery_date: values.surgery_date
          ? dayjs(values.surgery_date).hour(12).minute(0).second(0).toISOString()
          : null,
        anticipated_ship_date: values.anticipated_ship_date
          ? dayjs(values.surgery_date).hour(12).minute(0).second(0).toISOString()
          : null,
      };
      await axios.post('/case/create', payload);
      messageApi.success('Case created successfully');

      navigate('/case/list');
      // form.resetFields();
    } catch (error) {
      messageApi.error('Failed to create case');
      console.error(error);
    }
  };

  return (
    <>
      {contextHolder}
      <CustomHeader>
        <h1 className='text-2xl font-bold'>Create New Case</h1>
      </CustomHeader>
      <Layout.Content className='p-4'>
        <Card title='Case Information'>
          <Form form={form} layout='vertical' onFinish={handleSubmit} className='grid grid-cols-2 gap-x-4'>
            <Form.Item name='surgeon_id' label='Surgeon' rules={[{ required: true }]}>
              <Select placeholder='Select a surgeon' options={surgeonOptions} />
            </Form.Item>
            <Form.Item label='Patient Name' name='patient_name' rules={[{ required: true }]}>
              <Input placeholder='Enter patient name' />
            </Form.Item>
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
            </Form.Item>
            <Form.Item label='Surgery Date' name='surgery_date' rules={[{ required: true }]}>
              <DatePicker className='w-full' placeholder='Select surgery date' format='DD-MM-YYYY' />
            </Form.Item>
            <Form.Item name='scan_type' label='Scan Type'>
              <Input placeholder='Enter scan type' allowClear />
            </Form.Item>
            <Form.Item label='Anticipated ship date' name='anticipated_ship_date'>
              <DatePicker className='w-full' placeholder='Select Anticipated ship date' format='DD-MM-YYYY' />
            </Form.Item>
            <Form.Item label='Product / Service' name='product'>
              <Input placeholder={'Enter product'} allowClear />
            </Form.Item>
            <Form.Item label='Priority' name='priority'>
              <Select
                placeholder={'Select priority'}
                options={[
                  { label: 'Low', value: 'low' },
                  { label: 'Medium', value: 'medium' },
                  { label: 'High', value: 'high' },
                ]}
              />
            </Form.Item>{' '}
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
