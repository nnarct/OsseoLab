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
  const [useAgeInput, setUseAgeInput] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();
  const { data: surgeons } = useDoctorSelectOptions();

  const surgeonOptions = (surgeons || []).map((doc: DoctorSelectOption) => ({
    label: `${doc.firstname} ${doc.lastname}`,
    value: doc.id,
  }));

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (!useAgeInput && values.patient_dob) {
        values.patient_dob = dayjs(values.patient_dob).hour(12).minute(0).second(0).toISOString();
      } else {
        values.patient_dob = dayjs(values.patient_dob).hour(12).minute(0).second(0).toString();
      }
      delete values.patient_dob;
      const payload = {
        ...values,
        surgery_date: values.surgery_date
          ? dayjs(values.surgery_date).hour(12).minute(0).second(0).toISOString()
          : null,
      };
      console.log({ payload });
      const res = await axios.post('/case/create', payload);
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
          <Form size='small' form={form} layout='vertical' onFinish={handleSubmit} className='grid grid-cols-2 gap-x-4'>
            <Form.Item name='surgeon_id' label='Surgeon' rules={[{ required: true }]}>
              <Select placeholder='Select a surgeon' options={surgeonOptions} />
            </Form.Item>
            <Form.Item name='patient_name' label='Patient Name' rules={[{ required: true }]}>
              <Input placeholder='Enter patient name' />
            </Form.Item>

            <Form.Item name='surgery_date' label='Surgery Date' rules={[{ required: true }]}>
              <DatePicker className='w-full' placeholder='Select surgery date' format='DD-MM-YYYY' />
            </Form.Item>
            <Form.Item name='scan_type' label='Scan Type'>
              <Input placeholder='Enter scan type' />
            </Form.Item>

            <Form.Item
              label={
                <div className='flex items-center gap-x-2'>
                  Patient Age
                  <Switch checked={useAgeInput} onChange={setUseAgeInput} />
                  Date of Birth
                </div>
              }
              name='patient_dob'
            >
              {useAgeInput ? (
                <DatePicker className='w-full' placeholder='Select patient DOB' />
              ) : (
                <Input type='number' min={0} placeholder='Enter patient age' />
              )}
            </Form.Item>

            <Form.Item name='patient_gender' label='Patient Gender'>
              <Select
                placeholder='Select gender'
                options={[
                  { label: 'Female', value: 'female' },
                  { label: 'Male', value: 'male' },
                  { label: 'Other', value: 'other' },
                ]}
              />
            </Form.Item>
            <Form.Item name='problem_description' label='Problem Description'>
              <TextArea rows={3} placeholder='Describe the patient problem' />
            </Form.Item>
            <Form.Item name='additional_note' label='Additional Note'>
              <TextArea rows={3} placeholder='Enter any additional notes' />
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
