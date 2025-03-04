import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  Checkbox,
  ConfigProvider,
  Flex,
  Form as AntdForm,
  Image,
  Input,
  Typography,
  message,
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
  console.log('login page');
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
      <Flex align='center' justify='center' className='bg-primary h-screen w-screen'>
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
          </Form>
        </Card>
      </Flex>
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
