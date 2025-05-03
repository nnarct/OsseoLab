import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { ConfigProvider, Button, Image, Form, Typography, Input, Select, Card, message, Divider } from 'antd';
import { axios } from '@/config/axiosConfig';
import { UserRole } from '@/types/user';
import LOGO from '@/assets/OsseoLabsLogo.svg';
import { useAuth } from '@/hooks/useAuth';

const { Item } = Form;
const { Option } = Select;

const RegisterPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState<boolean>(false);

  if (user) return <Navigate to={'/'} />;

  const goLogin = () => navigate('/login');

  const onSubmit = async (values: RegisterFormDataType) => {
    setLoading(true);
    try {
      await axios.post('/register', values);
      messageApi.success('Register success');
      goLogin();
    } catch (error) {
      if (error instanceof AxiosError) {
        messageApi.warning(error.response?.data.error || error.message);
      } else {
        messageApi.error('Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfigProvider theme={{ token: { colorText: '#046759' } }}>
      {contextHolder}
      <Card className='rounded-xl'>
        <Image preview={false} src={LOGO} />
        <Typography.Title level={5} className='!text-primary text-center'>
          Register
        </Typography.Title>
        <Form<RegisterFormDataType>
          form={form}
          layout='vertical'
          requiredMark={'optional'}
          onFinish={onSubmit}
          disabled={loading}
        >
          <Item
            name='firstname'
            label={<div className='font-medium'>First Name</div>}
            rules={[{ required: true, message: 'Please input your first name!' }]}
          >
            <Input placeholder='Enter your first name' />
          </Item>
          <Item
            name='lastname'
            label={<div className='font-medium'>Last Name</div>}
            rules={[{ required: true, message: 'Please input your last name!' }]}
          >
            <Input placeholder='Enter your last name' />
          </Item>
          <Item
            name='username'
            label={<div className='font-medium'>Username</div>}
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input placeholder='Enter your username' />
          </Item>
          <Item
            name='email'
            label={<div className='font-medium'>Email address</div>}
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input placeholder='Enter your email' />
          </Item>
          <Item
            name='password'
            label={<div className='font-medium'>Password</div>}
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password placeholder='password' />
          </Item>
          <Item
            name='role'
            label={<div className='font-medium'>Requested Role</div>}
            rules={[{ required: true, message: 'Please select your  requested role!' }]}
            initialValue={UserRole.Doctor}
          >
            <Select placeholder='Role'>
              <Option value={UserRole.Admin}>Admin</Option>
              <Option value={UserRole.Doctor}>Doctor</Option>
              <Option value={UserRole.Technician}>Technician</Option>
            </Select>
          </Item>

          <Item className='!mb-0'>
            <Button type='primary' htmlType='submit' className='w-full'>
              {loading ? 'Registering...' : 'Register'}
            </Button>
          </Item>
          <Divider />
          <div className='flex justify-center gap-x-2'>
            <Typography.Text>Already have an account?</Typography.Text>
            <Typography.Text>|</Typography.Text>

            <Typography.Link onClick={goLogin}>Login Now</Typography.Link>
          </div>
        </Form>
      </Card>
    </ConfigProvider>
  );
};

export default RegisterPage;

interface RegisterFormDataType {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
  role: UserRole;
}
