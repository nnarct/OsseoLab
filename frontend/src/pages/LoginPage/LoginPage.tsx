import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Checkbox, ConfigProvider, Flex, Form as AntdForm, Image, Input, Typography, Select } from 'antd';
import styled from 'styled-components';
import LOGO_IMG from '@/assets/OsseoLabsLogo.svg';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/user';
import { HOMEPAGE_PATH } from '@/constants/path';

type LoginFieldType = {
  email: string;
  password: string;
  role: UserRole;
  remember?: boolean;
};

const LoginPage = () => {
  console.log('login page');
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form] = Form.useForm<LoginFieldType>();
  const [loading, setLoading] = useState<boolean>(false);
  const onSubmit = async (value: LoginFieldType) => {
    setLoading(true);
    await login(value.role, value.email, value.password);
    navigate(HOMEPAGE_PATH);
    setLoading(false);
  };

  return (
    <ConfigProvider theme={{ token: { colorText: '#046759' } }}>
      <Flex align='center' justify='center' className='bg-primary h-screen w-screen'>
        <Card className='rounded-xl'>
          <Image preview={false} src={LOGO_IMG} />
          <Typography.Title level={5} className='!text-primary text-center'>
            Login
          </Typography.Title>
          <Form form={form} layout='vertical' requiredMark={'optional'} onFinish={onSubmit} disabled={loading}>
            <Form.Item
              name='email'
              label={<div className='font-medium'>Email</div>}
              rules={[{ required: true, message: 'Please input your email!' }]}
            >
              <Input placeholder='osseolabs@gmail.com' />
            </Form.Item>
            <Form.Item
              name='password'
              label={<div className='font-medium'>Password</div>}
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password placeholder='password' />
            </Form.Item>
            <Form.Item name='remember' valuePropName='checked' className='!text-gray-400'>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <Form.Item
              name='role'
              label='Role (for development only)'
              rules={[{ required: true, message: 'Please select your role!' }]}
            >
              <Select defaultValue={'admin'}>
                {['admin', 'technician', 'doctor'].map((role) => (
                  <Select.Option key={role} value={role}>
                    {role}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item className='!mb-0'>
              <Button type='primary' htmlType='submit' loading={loading} className='w-full'>
                Login
              </Button>
            </Form.Item>
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
