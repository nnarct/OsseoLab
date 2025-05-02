import { Form, Input, Button, DatePicker, Select, message, Card, Layout, Switch } from 'antd';
import { axios } from '@/config/axiosConfig';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import CustomHeader from '@/components/common/CustomHeader';
import { useNavigate } from 'react-router-dom';

const { TextArea } = Input;

const CaseCreateForm = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [useAgeInput, setUseAgeInput] = useState(true);
  const [surgeons, setSurgeons] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  useEffect(() => {
    axios.get('/doctor/select-options').then((res) => {
      setSurgeons(
        res.data.data.map((doc: any) => ({
          label: `${doc.firstname} ${doc.lastname}`,
          value: doc.id,
        }))
      );
    });
  }, []);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (!useAgeInput && values.patient_dob) {
        const age = parseInt(values.patient_dob, 10);
        const dob = dayjs().subtract(age, 'year');
        values.patient_dob = dob.toISOString();
      } else {
        values.patient_dob = values.patient_dob?.toISOString() || null;
      }
      delete values.patient_dob;
      const payload = {
        ...values,
        surgery_date: values.surgery_date?.toISOString() || null,
      };
      console.log({ payload });
      const res = await axios.post('/case/create', payload);
      messageApi.success('Case created successfully');
      console.log({ res });
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
              <Select placeholder='Select a surgeon' options={surgeons} />
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
