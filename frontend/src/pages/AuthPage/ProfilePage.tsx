import { useAuth } from '@/hooks/useAuth';
import { useCurrentUser, useUpdateCurrentUser } from '@/services/user/user.service';
import { Avatar, Button, Card, Form, Input, Layout, message, notification, Select } from 'antd';

const ProfilePage = () => {
  const [form] = Form.useForm<UserProfile>();
  const [notificationApi, contextHolder] = notification.useNotification();

  const { setAccessToken } = useAuth();
  const { data, isLoading, isError } = useCurrentUser();
  const updateCurrentUser = useUpdateCurrentUser();

  const onFinish = async (values: UserProfile) => {
    try {
      const { accessToken } = await updateCurrentUser.mutateAsync(values);
      setAccessToken(accessToken);
      notificationApi.open({
        type: 'success',
        message: 'Profile updated successfully',
      });
    } catch (err) {
      notificationApi.open({
        type: 'error',
        message: 'Error updating profile',
        description: (err as Error).message,
      });
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
      <Layout.Header
        className='flex items-center'
        style={{
          background: 'white',
          height: '73px',
          padding: '0 24px',
          borderBottom: '1px solid rgba(5, 5, 5, 0.05)',
          borderLeft: '1px solid rgba(5, 5, 5, 0.05)',
        }}
      >
        <h1 className='text-2xl font-bold'>Profile Page</h1>
      </Layout.Header>
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
            {data.role === 'admin' ? 'Admin' : data.role === 'doctor' ? 'Surgeon' : 'Technician'}
          </div>
          <Form<UserProfile>
            form={form}
            layout='vertical'
            className='grid w-full grid-cols-2 gap-x-4'
            onFinish={onFinish}
          >
            <Form.Item label='First Name' name='firstname' initialValue={data.firstname}>
              <Input placeholder='Enter your first name' className='rounded border border-gray-300 p-2' />
            </Form.Item>
            <Form.Item label='Last Name' name='lastname' initialValue={data.lastname}>
              <Input placeholder='Enter your last name' className='rounded border border-gray-300 p-2' />
            </Form.Item>
            <Form.Item label='Email Address' name='email' initialValue={data.email}>
              <Input
                placeholder='Enter your email address'
                type='email'
                disabled
                className='rounded border border-gray-300 p-2'
              />
            </Form.Item>
            <Form.Item label='Mobile Number' name='mobile' initialValue={'-'}>
              <Input
                placeholder='Enter your mobile number'
                type='text'
                disabled
                className='rounded border border-gray-300 p-2'
              />
            </Form.Item>
            {/* dob */}
            <Form.Item label='Date of Birth' name='dob' initialValue={data.dob}>
              <Input
                disabled
                placeholder='Enter your date of birth'
                type='text'
                className='rounded border border-gray-300 p-2'
              />
            </Form.Item>
            <Form.Item label='Username' name='username' initialValue={data.username}>
              <Input
                placeholder='Enter your username'
                type='text'
                className='rounded border border-gray-300 p-2'
                disabled
              />
            </Form.Item>
            {/* gender select */}
            <Form.Item label='Gender' name='gender' initialValue={data.gender || 'female'}>
              <Select
                placeholder='Select your gender'
                options={[
                  { label: 'Male', value: 'male' },
                  { label: 'Female', value: 'female' },
                  { label: 'Other', value: 'other' },
                ]}
              />
            </Form.Item>
            <Form.Item label='Country' name='country' initialValue={data.country}>
              <Select
                showSearch
                placeholder='Select your country'
                options={[
                  { label: 'Argentina', value: 'Argentina' },
                  { label: 'Australia', value: 'Australia' },
                  { label: 'Brazil', value: 'Brazil' },
                  { label: 'Canada', value: 'Canada' },
                  { label: 'China', value: 'China' },
                  { label: 'France', value: 'France' },
                  { label: 'Germany', value: 'Germany' },
                  { label: 'India', value: 'India' },
                  { label: 'Italy', value: 'Italy' },
                  { label: 'Japan', value: 'Japan' },
                  { label: 'Mexico', value: 'Mexico' },
                  { label: 'Netherlands', value: 'Netherlands' },
                  { label: 'Norway', value: 'Norway' },
                  { label: 'Russia', value: 'Russia' },
                  { label: 'Saudi Arabia', value: 'Saudi Arabia' },
                  { label: 'South Africa', value: 'South Africa' },
                  { label: 'Spain', value: 'Spain' },
                  { label: 'Sweden', value: 'Sweden' },
                  { label: 'Thailand', value: 'Thailand' },
                  { label: 'Turkey', value: 'Turkey' },
                  { label: 'United Kingdom', value: 'United Kingdom' },
                  { label: 'United States', value: 'United States' },
                  { label: 'Other', value: 'Other' },
                ]}
              />
            </Form.Item>
            <Form.Item className='col-span-2'>
              <div className='flex items-center justify-center gap-x-4'>
                <Button htmlType='submit' type='primary' className='w-18'>
                  Save
                </Button>
                <Button onClick={() => form.resetFields()} type='default' className='w-18'>
                  Cancel
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Card>
      </Layout.Content>
    </>
  );
};

export default ProfilePage;

interface UserProfile {
  firstname: string | null;
  lastname: string | null;
  email: string | null;
  mobile: string | null;
  dob: string | null;
  username: string | null;
  gender: 'male' | 'female' | 'other';
  country: string | null;
}
