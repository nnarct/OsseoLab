import { axios } from '@/config/axiosConfig';
import CaseFilesList from '@/components/feature/Case/CaseFilesList';
import { useGetCaseById } from '@/services/case/case.service';
import { Button, Card, DatePicker, Divider, Form, Input, notification, Select, Switch, Typography } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const CaseDetail = ({ id }: { id: string }) => {
  const navigate = useNavigate();
  const { role } = useAuth();
  const { data, isLoading } = useGetCaseById(id);
  const [form] = Form.useForm();
  const [useDobInput, setUseDobInput] = useState(true);
  const [notificationApi, contextHolder] = notification.useNotification();

  const {
    surgeon,
    patient_name,
    patient_gender,
    patient_dob,
    patient_age: original_age,
    surgery_date,
    scan_type,
    additional_note,
    problem_description,
    priority,
    case_number,
    status,
    product,
    anticipated_ship_date,
    created_by,
  } = data ? data : {};

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (values.surgery_date) {
        values.surgery_date = dayjs(values.surgery_date).hour(12).minute(0).second(0).toISOString();
      }

      delete values.surgeon;

      let patientDobValue = null;

      if (values.patient_dob) {
        patientDobValue = dayjs(values.patient_dob).hour(12).minute(0).second(0).toISOString();
        delete values.patient_dob;
      } else if (values.patient_age) {
        const isSameAge = original_age ? Number(values.patient_age) === Number(original_age) : false;
        patientDobValue = isSameAge
          ? data?.patient_dob
          : dayjs().subtract(Number(values.patient_age), 'year').format('YYYY-MM-DD');
      }
      if (values.anticipated_ship_date) {
        values.anticipated_ship_date = dayjs(values.anticipated_ship_date).hour(12).minute(0).second(0).toISOString();
      }

      const payload = {
        patient_dob: patientDobValue,
        ...values,
      };

      await axios.put(`/case/${id}`, payload);
      notificationApi.success({ message: 'Case updated successfully' });
    } catch (error) {
      console.error(error);
      notificationApi.error({
        message: 'Failed to update case',
        description: error instanceof Error ? error.message : '',
      });
    }
  };
  return (
    <Card loading={isLoading} title={`CASE${data ? String(case_number).padStart(3, '0') : ''}`}>
      {contextHolder}
      {data ? (
        <>
          <Form
            onFinish={handleSubmit}
            className='grid grid-cols-2 gap-x-4'
            layout='vertical'
            form={form}
            initialValues={{
              anticipated_ship_date: anticipated_ship_date ? dayjs(new Date(anticipated_ship_date * 1000)) : undefined,
              product,
              case_number: `CASE${String(case_number).padStart(3, '0')}`,
              surgeon: surgeon ? `${surgeon.firstname} ${surgeon.lastname}` : 'N/A',
              patient_name,
              patient_gender,
              patient_dob: patient_dob ? dayjs(new Date(patient_dob * 1000)) : undefined,
              patient_age: original_age,
              surgery_date: surgery_date ? dayjs(new Date(surgery_date * 1000)) : undefined,
              scan_type,
              additional_note,
              problem_description,
              priority,
              status,
              created_by: created_by ? `${created_by.username} (${created_by.firstname} ${created_by.lastname})` : '-',
            }}
            requiredMark={role === 'doctor' ? false : true}
          >
            <Form.Item label='Case ID' name='case_number'>
              <Input disabled style={role === 'doctor' ? { color: 'black' } : {}} />
            </Form.Item>
            <Form.Item label='Case Code' name='case_code' rules={[{ required: true }]}>
              <Input
                placeholder={role === 'doctor' ? '-' : 'Enter case code'}
                allowClear
                disabled={role === 'doctor'}
                style={role === 'doctor' ? { color: 'black' } : {}}
              />
            </Form.Item>
            <Form.Item label='Surgeon' name='surgeon'>
              <Input
                placeholder={role === 'doctor' ? '-' : 'Enter surgeon name'}
                disabled
                style={role === 'doctor' ? { color: 'black' } : {}}
              />
            </Form.Item>
            <Form.Item label='Patient Name' name='patient_name' rules={[{ required: true }]}>
              <Input
                placeholder={role === 'doctor' ? '-' : 'Enter patient name'}
                disabled={role === 'doctor'}
                style={role === 'doctor' ? { color: 'black' } : {}}
              />
            </Form.Item>

            <Form.Item label='Patient Gender' name='patient_gender'>
              <Select
                placeholder={role === 'doctor' ? '-' : 'Select Patient gender'}
                options={[
                  { label: 'Female', value: 'female' },
                  { label: 'Male', value: 'male' },
                  { label: 'Other', value: 'other' },
                ]}
                disabled={role === 'doctor'}
                style={role === 'doctor' ? { color: 'black' } : {}}
              />
            </Form.Item>

            <Form.Item
              label={
                <div className='flex items-center gap-x-2'>
                  Patient Age
                  <Switch
                    size='small'
                    checked={useDobInput}
                    onChange={(checked) => setUseDobInput(checked)}
                    disabled={role === 'doctor'}
                  />
                  Date of Birth
                </div>
              }
            >
              {useDobInput ? (
                <Form.Item name='patient_dob' noStyle>
                  <DatePicker
                    className='w-full'
                    placeholder={role === 'doctor' ? '-' : 'Select patient DOB'}
                    format='DD-MM-YYYY'
                    disabled={role === 'doctor'}
                    style={role === 'doctor' ? { color: 'black' } : {}}
                  />
                </Form.Item>
              ) : (
                <Form.Item name='patient_age' noStyle>
                  <Input
                    type='number'
                    min={0}
                    placeholder={role === 'doctor' ? '-' : 'Enter patient age'}
                    disabled={role === 'doctor'}
                    style={role === 'doctor' ? { color: 'black' } : {}}
                  />
                </Form.Item>
              )}
            </Form.Item>
            <Form.Item label='Surgery Date' name='surgery_date' rules={[{ required: true }]}>
              <DatePicker
                className='w-full'
                placeholder={role === 'doctor' ? '-' : 'Select surgery date'}
                format='DD-MM-YYYY'
                disabled={role === 'doctor'}
                style={role === 'doctor' ? { color: 'black' } : {}}
              />
            </Form.Item>
            <Form.Item label='Anticipated ship date' name='anticipated_ship_date'>
              <DatePicker
                className='w-full'
                placeholder={role === 'doctor' ? '-' : 'Select Anticipated ship date'}
                format='DD-MM-YYYY'
                disabled={role === 'doctor'}
                style={role === 'doctor' ? { color: 'black !important' } : {}}
              />
            </Form.Item>
            <Form.Item label='Scan Type' name='scan_type'>
              <Input
                placeholder={role === 'doctor' ? '-' : 'Enter scan type'}
                allowClear
                disabled={role === 'doctor'}
                style={role === 'doctor' ? { color: 'black' } : {}}
              />
            </Form.Item>
            <Form.Item label='Product / Service' name='product'>
              <Input
                placeholder={role === 'doctor' ? '-' : 'Enter product'}
                allowClear
                disabled={role === 'doctor'}
                style={role === 'doctor' ? { color: 'black' } : {}}
              />
            </Form.Item>
            <Form.Item label='Problem Description' name='problem_description'>
              <Input.TextArea
                placeholder={role === 'doctor' ? '-' : 'Enter problem description'}
                allowClear
                disabled={role === 'doctor'}
                style={role === 'doctor' ? { color: 'black' } : {}}
              />
            </Form.Item>
            <Form.Item label='Additional Note' name='additional_note'>
              <Input.TextArea
                placeholder={role === 'doctor' ? '-' : 'Enter additional note'}
                allowClear
                disabled={role === 'doctor'}
                style={role === 'doctor' ? { color: 'black' } : {}}
              />
            </Form.Item>

            <Form.Item label='Priority' name='priority'>
              <Select
                placeholder={role === 'doctor' ? '-' : 'Select priority'}
                options={[
                  { label: 'Low', value: 'low' },
                  { label: 'Medium', value: 'medium' },
                  { label: 'High', value: 'high' },
                ]}
                disabled={role === 'doctor'}
                style={role === 'doctor' ? { color: 'black' } : {}}
              />
            </Form.Item>
            <Form.Item label='Status' name='status'>
              <Select
                placeholder={role === 'doctor' ? '-' : 'Select status'}
                options={[
                  { label: 'Case creation', value: 'creation' },
                  { label: 'Planning & Design', value: 'planing' },
                  { label: 'Device Design', value: 'device-design' },
                  { label: 'Design Confirmation', value: 'design-confirmation' },
                  // { label: 'Case Complete', value: 'complete' },
                ]}
                disabled={role === 'doctor'}
                style={role === 'doctor' ? { color: 'black' } : {}}
              />
            </Form.Item>
            <Form.Item label='Created By' name='created_by'>
              <Input disabled />
            </Form.Item>

            {role !== 'doctor' && (
              <div className='col-span-2 flex items-center justify-center gap-x-4'>
                <Button onClick={() => navigate('/case/list')} className='w-22' size='middle'>
                  Cancel
                </Button>
                <Button type='primary' htmlType='submit' className='w-22' size='middle'>
                  Save
                </Button>
              </div>
            )}
          </Form>
          <div className='col-span-2 flex flex-col pt-2 text-xs'>
            <Typography.Text type='secondary'>
              Created At: {dayjs.unix(data.created_at).format('DD MMM YYYY HH:mm:ss A')}
            </Typography.Text>
            <Typography.Text type='secondary'>
              Last Updated: {dayjs.unix(data.last_updated).format('DD MMM YYYY HH:mm:ss A')}
            </Typography.Text>
          </div>
          <Divider />
          <CaseFilesList files={data.files} caseId={id} caseNumber={data.case_number} />
        </>
      ) : (
        <></>
      )}
    </Card>
  );
};

export default CaseDetail;
