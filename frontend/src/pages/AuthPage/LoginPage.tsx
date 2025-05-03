import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  Checkbox,
  ConfigProvider,
  Form as AntdForm,
  Image,
  Input,
  Typography,
  message,
  Divider,
} from 'antd';
import styled from 'styled-components';
import LOGO from '@/assets/OsseoLabsLogo.svg';
import { useAuth } from '@/hooks/useAuth';
import { HOMEPAGE_PATH } from '@/constants/path';
import { AxiosError } from 'axios';

type LoginFieldType = {
  email: string;
  password: string;
  remember?: boolean;
};

const { Item } = AntdForm;

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm<LoginFieldType>();
  const [loading, setLoading] = useState<boolean>(false);

  if (user) return <Navigate to={'/'} />;
  const onSubmit = async (value: LoginFieldType) => {
    try {
      setLoading(true);
      await login(value.email, value.password);
      navigate(HOMEPAGE_PATH);
    } catch (error) {
      console.log({ error });
      if (error instanceof AxiosError) {
        messageApi.error(error.response?.data.error);
      } else if (error instanceof Error) {
        messageApi.error(error.message);
      }
    }
    setLoading(false);
  };

  return (
    <ConfigProvider theme={{ token: { colorText: '#046759' } }}>
      {contextHolder}
      <Card className='rounded-xl'>
        <Image preview={false} src={LOGO} />
        <Typography.Title level={5} className='!text-primary text-center'>
          Login
        </Typography.Title>
        <Form form={form} layout='vertical' requiredMark={'optional'} onFinish={onSubmit} disabled={loading}>
          <Item
            name='email'
            label={<div className='font-medium'>Email</div>}
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input placeholder='osseolabs@gmail.com' />
          </Item>
          <Item
            name='password'
            label={<div className='font-medium'>Password</div>}
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password placeholder='password' />
          </Item>
          <Item name='remember' valuePropName='checked' className='!text-gray-400'>
            <Checkbox>Remember me</Checkbox>
          </Item>

          <Item className='!mb-0'>
            <Button type='primary' htmlType='submit' className='w-full'>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </Item>
          <Divider />
          <div className='flex justify-center gap-x-2'>
            <Typography.Text>Don't have an account yet?</Typography.Text>
            <Typography.Text>|</Typography.Text>

            <Typography.Link onClick={() => navigate('/register')}>Register Now</Typography.Link>
          </div>
        </Form>
      </Card>
    </ConfigProvider>
  );
};

export default LoginPage;

const Form = styled(AntdForm<LoginFieldType>)`
  .ant-form-item {
    margin-bottom: 20px !important;
  }
  .ant-form-item-explain-error {
    font-size: 12px;
  }
`;
