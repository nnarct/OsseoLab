import CustomHeader from '@/components/common/CustomHeader';
import { COUNTRIES } from '@/constants/option';
import { useAuth } from '@/hooks/useAuth';
import { useCurrentUser, useUpdateCurrentUser } from '@/services/user/user.service';
import { FormUserProfile, UserRole } from '@/types/user';
import { Avatar, Button, Card, DatePicker, Divider, Form, Input, Layout, notification, Select, Typography } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';

const ProfilePage = () => {
  const updateCurrentUser = useUpdateCurrentUser();
  const submitTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { role } = useAuth();
  const [form] = Form.useForm<FormUserProfile>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notificationApi, contextHolder] = notification.useNotification();

  const { setAccessToken } = useAuth();
  const { data, isLoading, isError } = useCurrentUser();
  const isDoctor = role === UserRole.Doctor;
  // Update form fields when data changes
  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        firstname: data.firstname,
        username: data.username,
        lastname: data.lastname,
        phone: data.phone,
        dob: data.dob ? dayjs.unix(data.dob) : undefined,
        gender: data.gender,
        country: data.country,
      });
      if (isDoctor) {
        form.setFieldsValue({
          hospital: data.hospital,
          reference: data.reference,
          doctor_registration_id: data.doctor_registration_id,
        });
      }
    }
  }, [data, form, isDoctor]);

  const onFinish = async (values: FormUserProfile) => {
    // Set a timer to delay showing the spinner for 1 second
    submitTimerRef.current = setTimeout(() => setIsSubmitting(true), 1000);
    if (values.dob && typeof values.dob !== 'string') {
      values.dob = values.dob.format('YYYY-MM-DD');
    }
    try {
      const { accessToken } = await updateCurrentUser.mutateAsync(values);
      setAccessToken(accessToken);
      notificationApi.success({
        message: 'Profile updated successfully',
        placement: 'top',
      });
    } catch (error) {
      if (submitTimerRef.current) clearTimeout(submitTimerRef.current);
      notificationApi.error({
        message: 'Error updating profile',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        placement: 'top',
      });
    } finally {
      if (submitTimerRef.current) clearTimeout(submitTimerRef.current);
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError || !data) {
    return <div>Error getting user data</div>;
  }

  return (
    <>
      {contextHolder}
      <CustomHeader>
        <h1 className='text-2xl font-bold'>Profile Page</h1>
      </CustomHeader>
      <Layout.Content className='p-4'>
        <Card title={'Profile Information'}>
          <div className='mb-6 flex flex-col items-center justify-center gap-4 font-bold'>
            <Avatar
              size={96}
              src={data.profile_image || undefined}
              style={{ backgroundColor: '#87d068', fontSize: 24 }}
            >
              {data.firstname[0].toUpperCase()}
            </Avatar>
            <Divider> {data.role === 'admin' ? 'Admin' : data.role === 'doctor' ? 'Surgeon' : 'Technician'}</Divider>
          </div>
          <Form<FormUserProfile>
            form={form}
            layout='vertical'
            className='grid w-full grid-cols-2 gap-x-4'
            onFinish={onFinish}
            disabled={isLoading || isSubmitting}
          >
            <Form.Item
              label='First Name'
              name='firstname'
              initialValue={data.firstname}
              rules={[{ required: true, message: 'First name is required' }]}
            >
              <Input placeholder='Enter your first name' allowClear />
            </Form.Item>
            <Form.Item
              label='Last Name'
              name='lastname'
              initialValue={data.lastname}
              rules={[{ required: true, message: 'Last name is required' }]}
            >
              <Input placeholder='Enter your last name' allowClear />
            </Form.Item>
            <Form.Item label='Email Address' name='email' initialValue={data.email}>
              <Input placeholder='Enter your email address' type='email' disabled />
            </Form.Item>
            <Form.Item
              label='Mobile Number'
              name='phone'
              initialValue={data.phone}
              rules={[
                {
                  pattern: /^[0-9]{10}$/,
                  message: 'Please enter a valid mobile number',
                },
              ]}
            >
              <Input max={10} placeholder='Enter your mobile number' type='text' allowClear />
            </Form.Item>
            {/* dob */}
            <Form.Item label='Date of Birth (AD)' name='dob' initialValue={data.dob ? dayjs.unix(data.dob) : undefined}>
              <DatePicker
                maxDate={dayjs()}
                format='DD-MM-YYYY'
                className='w-full'
                placeholder='Enter your date of birth'
                type='text'
                allowClear
              />
            </Form.Item>
            <Form.Item label='Username' name='username' initialValue={data.username}>
              <Input placeholder='Enter your username' type='text' disabled={!!data.username} />
            </Form.Item>
            {/* gender select */}
            <Form.Item label='Gender' name='gender' initialValue={data.gender}>
              <Select
                placeholder='Select your gender'
                options={[
                  { label: 'Female', value: 'female' },
                  { label: 'Male', value: 'male' },
                  { label: 'Other', value: 'other' },
                ]}
              />
            </Form.Item>

            <Form.Item label='Country' name='country' initialValue={data.country}>
              <Select showSearch placeholder='Select your country' options={COUNTRIES} allowClear />
            </Form.Item>
            {isDoctor && (
              <>
                <Form.Item label='Doctor Registration ID' name={'doctor_registration_id'}>
                  <Input placeholder='Doctor Registration ID' allowClear />
                </Form.Item>
                <Form.Item label='Hospital Name' name={'hospital'}>
                  <Input placeholder='Hospital Name' allowClear />
                </Form.Item>
                <Form.Item label='Reference' name={'reference'} className='col-span-2'>
                  <Input placeholder='Reference' allowClear />
                </Form.Item>
              </>
            )}

            <Form.Item className='col-span-2'>
              <div className='flex items-center justify-center gap-x-4'>
                <Button htmlType='submit' type='primary' className='w-18' loading={isSubmitting}>
                  Save
                </Button>
                <Button onClick={() => form.resetFields()} type='default' className='w-18'>
                  Cancel
                </Button>
              </div>
            </Form.Item>
          </Form>
          <div className='col-span-2 flex flex-col text-xs'>
            <Typography.Text type='secondary'>
              Created At: {dayjs.unix(data.created_at).format('DD MMM YYYY HH:mm:ss A')}
            </Typography.Text>
            <Typography.Text type='secondary'>
              Last Updated: {dayjs.unix(data.last_updated).format('DD MMM YYYY HH:mm:ss A')}
            </Typography.Text>
          </div>
        </Card>
      </Layout.Content>
    </>
  );
};

export default ProfilePage;
