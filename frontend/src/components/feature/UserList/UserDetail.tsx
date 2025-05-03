import { COUNTRIES } from '@/constants/option';
import { useGetUserById } from '@/services/user/user.service';
import { Card, Descriptions, Form, Select, Input, Button, DatePicker, notification } from 'antd';
import dayjs from 'dayjs';
import { useRef, useState } from 'react';
import { axios } from '@/config/axiosConfig';
import queryClient from '@/config/queryClient';

const EmptyUserDetail = () => (
  <Card title='User Information'>
    <p>Sorry, no user data available.</p>
  </Card>
);

const UserDetail = ({ id }: { id: string }) => {
  const { data, isLoading } = useGetUserById(id);

  const [editMode, setEditMode] = useState(false);
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [notificationApi, contextHolder] = notification.useNotification();

  const handleSave = async (values) => {
    // Set a timer to delay showing the spinner for 1 second
    submitTimerRef.current = setTimeout(() => setIsSubmitting(true), 1000);
    if (values.dob && typeof values.dob !== 'string') {
      values.dob = values.dob.format('YYYY-MM-DD');
    }

    try {
      await axios.put(`/user/${id}`, values);
      notificationApi.success({
        message: 'User data updated successfully',
        placement: 'top',
      });
      queryClient.invalidateQueries({ queryKey: ['user', id] });
      setEditMode(false);
    } catch (error) {
      if (submitTimerRef.current) clearTimeout(submitTimerRef.current);
      notificationApi.error({
        message: 'Error updating user data',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        placement: 'top',
      });
    } finally {
      if (submitTimerRef.current) clearTimeout(submitTimerRef.current);
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Card title='User Information' loading={true} />;
  }
  if (!data) {
    return <EmptyUserDetail />;
  }
  return (
    <>
      {contextHolder}
      <Card title='User Information' extra={!editMode ? <Button onClick={() => setEditMode(true)}>Edit</Button> : null}>
        {editMode ? (
          <Form
            layout='vertical'
            form={form}
            initialValues={data}
            onFinish={handleSave}
            className='grid grid-cols-2 gap-x-4'
          >
            <Form.Item
              label='First Name'
              name='firstname'
              rules={[{ required: true, message: 'First name is required' }]}
            >
              <Input placeholder='Enter first name' />
            </Form.Item>
            <Form.Item label='Last Name' name='lastname'>
              <Input placeholder='Enter last name' />
            </Form.Item>
            <Form.Item label='Username' name='username'>
              <Input placeholder='Enter username' />
            </Form.Item>
            <Form.Item label='Email' name='email' rules={[{ required: true, message: 'Email is required' }]}>
              <Input placeholder='Enter email address' type='email' />
            </Form.Item>
            <Form.Item
              label='Mobile Number'
              name='phone'
              rules={[
                {
                  pattern: /^[0-9]{10}$/,
                  message: 'Please enter a valid mobile number',
                },
              ]}
            >
              <Input max={10} placeholder='Enter your mobile number' type='text' allowClear />
            </Form.Item>
            <Form.Item label='Date of Birth' name='dob'>
              <DatePicker
                maxDate={dayjs()}
                format='DD-MM-YYYY'
                className='w-full'
                placeholder='Enter date of birth'
                type='text'
                allowClear
              />
            </Form.Item>
            <Form.Item label='Gender' name='gender'>
              <Select
                placeholder='Select gender'
                options={[
                  { label: 'Female', value: 'female' },
                  { label: 'Male', value: 'male' },
                  { label: 'Other', value: 'other' },
                ]}
              />
            </Form.Item>
            <Form.Item label='Country' name='country'>
              <Select showSearch placeholder='Select  country' options={COUNTRIES} allowClear />
            </Form.Item>

            <Form.Item className='col-span-2'>
              <div className='flex items-center justify-center gap-x-4'>
                <Button htmlType='submit' type='primary' className='w-18' loading={isSubmitting}>
                  Save
                </Button>
                <Button onClick={() => setEditMode(false)} type='default' className='w-18'>
                  Cancel
                </Button>
              </div>
            </Form.Item>
          </Form>
        ) : (
          <Descriptions>
            <Descriptions.Item label='Username'>{data.username}</Descriptions.Item>
            <Descriptions.Item label='First Name'>{data.firstname}</Descriptions.Item>
            <Descriptions.Item label='Last Name'>{data.lastname}</Descriptions.Item>
            <Descriptions.Item label='Email'>{data.email}</Descriptions.Item>
            <Descriptions.Item label='Phone'>{data.phone ?? '-'}</Descriptions.Item>
            <Descriptions.Item label='DOB'>{data.dob ?? '-'}</Descriptions.Item>
            <Descriptions.Item label='Gender'>{data.gender ?? '-'}</Descriptions.Item>
            <Descriptions.Item label='Country'>{data.country ?? '-'}</Descriptions.Item>
            <Descriptions.Item label='Role'>{data.role}</Descriptions.Item>
          </Descriptions>
        )}
      </Card>
    </>
  );
};

export default UserDetail;
