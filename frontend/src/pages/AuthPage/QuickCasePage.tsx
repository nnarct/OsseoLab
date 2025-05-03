import { useState } from 'react';
import { Card, Image, Typography, Form, Input, DatePicker, Button, Select, Divider, message } from 'antd';
import LOGO from '@/assets/OsseoLabsLogo.svg';
import { COUNTRIES, PRODUCTS } from '@/constants/option';
import { useSubmitQuickCase } from '@/services/case/case.service';
import { QuickCaseFormValues } from '@/types/case';

const QuickCasePage = () => {
  const [isOtherProduct, setIsOtherProduct] = useState(false);
  const [form] = Form.useForm<QuickCaseFormValues>();
  const [messageApi, contextHolder] = message.useMessage();
  const submitQuickCase = useSubmitQuickCase();

  const handleQuickCaseSubmit = async (values: QuickCaseFormValues) => {
    try {
      if (values.surgery_date && typeof values.surgery_date !== 'string') {
        values.surgery_date.format('YYYY-MM-DD');
      }
      await submitQuickCase.mutateAsync(values);
      messageApi.success('Your quick case request has been submitted. We’ll contact you shortly.');
      form.resetFields();
    } catch (error) {
      console.error(error);
      messageApi.error('Submission failed. Please try again.');
    }
  };

  return (
    <>
      {contextHolder}
      <Card className='mx-aut rounded-xl' style={{ width: 800 }}>
        <div className='mb-4 flex w-full items-center justify-center'>
          <Image preview={false} src={LOGO} />
        </div>
        <Typography.Title level={5} className='!text-primary text-center'>
          Submit a Quick Case Request
        </Typography.Title>
        <Form
          form={form}
          layout='vertical'
          onFinish={handleQuickCaseSubmit}
          className='grid grid-cols-2 gap-x-4'
        >
          <Form.Item name='firstname' label='First Name' rules={[{ required: true }]}>
            <Input placeholder='First Name' />
          </Form.Item>
          <Form.Item name='lastname' label='Last Name' rules={[{ required: true }]}>
            <Input placeholder='Last Name' />
          </Form.Item>
          <Form.Item name='email' label='Email Address' rules={[{ required: true, type: 'email' }]}>
            <Input placeholder='Email Address' />
          </Form.Item>
          <Form.Item
            name='phone'
            label='Mobile Number'
            rules={[
              { required: true, message: 'Please enter your mobile number' },
              { pattern: /^[0-9]{10}$/, message: 'Mobile number must be 10 digits' },
            ]}
          >
            <Input max={10} placeholder='Enter your mobile number' type='text' allowClear />
          </Form.Item>
          <Form.Item name='country' label='Country' rules={[{ required: true }]}>
            <Select showSearch placeholder='Select your country' options={COUNTRIES} allowClear />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Form.Item name='product' label='Product' rules={[{ required: true }]}>
              <Select
                showSearch
                placeholder='Product'
                options={[...PRODUCTS, { label: 'Other', value: 'Other' }]}
                allowClear
                onChange={(value) => setIsOtherProduct(value === 'Other')}
              />
            </Form.Item>

            {isOtherProduct && (
              <Form.Item name='otherProduct' label='Other Product'>
                <Input />
              </Form.Item>
            )}
          </Form.Item>

          <Form.Item name='anatomy' label='Anatomy' rules={[{ required: true }]}>
            <Input placeholder='Anatomy' />
          </Form.Item>
          <Form.Item name='surgery_date' label='Surgery Date' rules={[{ required: true }]}>
            <DatePicker format='DD-MM-YYYY' className='w-full' type='text' allowClear />
          </Form.Item>
          <Form.Item
            name='additionalInfo'
            label='Additional Information'
            className='col-span-2'
            style={{ marginBottom: 0 }}
          >
            <Input.TextArea rows={2} placeholder='Additional Information' />
          </Form.Item>
          <Form.Item className='col-span-2'>
            <Divider />
            <Button type='primary' htmlType='submit' block>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
};

export default QuickCasePage;
