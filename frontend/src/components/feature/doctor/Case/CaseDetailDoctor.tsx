import { axios } from '@/config/axiosConfig';
import CaseFilesList from '../../Case/CaseFilesList';
import { useGetCaseById } from '@/services/case/case.service';
import { Button, Card, DatePicker, Divider, Form, Input, notification, Select, Switch, Typography } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CaseDetailDoctor = ({ id }: { id: string }) => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetCaseById(id);
  const [form] = Form.useForm();
  const [useDobInput, setUseDobInput] = useState(true);

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
    case_number,
  } = data ? data : {};

  return (
    <Card loading={isLoading} title={`CASE${data ? String(case_number).padStart(3, '0') : ''}`}>
      {data ? (
        <>
          <Form 
            className='grid grid-cols-2 gap-x-4'
            layout='vertical'
            form={form}
            initialValues={{
              surgeon: surgeon ? `${surgeon.firstname} ${surgeon.lastname}` : 'N/A',
              patient_name,
              patient_gender,
              patient_dob: patient_dob ? dayjs(new Date(patient_dob * 1000)) : undefined,
              patient_age: original_age,
              surgery_date: surgery_date ? dayjs(new Date(surgery_date * 1000)) : undefined,
              scan_type,
              additional_note,
              problem_description,
            }}
          >
            <Form.Item label='Surgeon' name='surgeon'>
              <Input placeholder='Enter surgeon name' readOnly />
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
              label={
                <div className='flex items-center gap-x-2'>
                  Patient Age
                  <Switch size='small' checked={useDobInput} onChange={(checked) => setUseDobInput(checked)} />
                  Date of Birth
                </div>
              }
            >
              {useDobInput ? (
                <Form.Item name='patient_dob' noStyle>
                  <DatePicker className='w-full' placeholder='Select patient DOB' format='DD-MM-YYYY' />
                </Form.Item>
              ) : (
                <Form.Item name='patient_age' noStyle>
                  <Input type='number' min={0} placeholder='Enter patient age' />
                </Form.Item>
              )}
            </Form.Item>
            <Form.Item label='Surgery Date' name='surgery_date' rules={[{ required: true }]}>
              <DatePicker className='w-full' placeholder='Select surgery date' format='DD-MM-YYYY' />
            </Form.Item>
            <Form.Item label='Scan Type' name='scan_type'>
              <Input placeholder='Enter scan type' allowClear />
            </Form.Item>
            <Form.Item label='Problem Description' name='problem_description'>
              <Input.TextArea placeholder='Enter problem description' allowClear />
            </Form.Item>
            <Form.Item label='Additional Note' name='additional_note'>
              <Input.TextArea placeholder='Enter additional note' allowClear />
            </Form.Item>

            <div className='col-span-2 flex items-center justify-center gap-x-4'>
              <Button onClick={() => navigate('/case/list')} className='w-22' size='middle'>
                Cancel
              </Button>
              <Button type='primary' htmlType='submit' className='w-22' size='middle'>
                Save
              </Button>
            </div>
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

export default CaseDetailDoctor;
