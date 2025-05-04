import { useState } from 'react';
import { Card, Image, Typography, Form, Input, DatePicker, Button, Select, Divider, message, Upload } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import { AiOutlineInbox } from 'react-icons/ai';
import LOGO from '@/assets/OsseoLabsLogo.svg';
import { COUNTRIES, PRODUCTS } from '@/constants/option';
// import { submitQuickCaseCombined } from '@/api/case.api';

import { Dayjs } from 'dayjs';
import { useSubmitQuickCase } from '@/services/case/case.service';

const QuickCaseSubmitPage = () => {
  const [isOtherProduct, setIsOtherProduct] = useState<boolean>(false);
  const [form] = Form.useForm<QuickCaseFormValues>();
  const [messageApi, contextHolder] = message.useMessage();
  // const submitQuickCase = useSubmitQuickCase();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const submitQuickCase = useSubmitQuickCase();
  const handleQuickCaseSubmit = async (values: QuickCaseFormValues) => {
    setIsSubmitting(true);
    try {
      if (values.surgery_date && typeof values.surgery_date !== 'string') {
        values.surgery_date = values.surgery_date.format('YYYY-MM-DD');
      }

      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value && typeof value !== 'object') {
          formData.append(key, value);
        }
      });

      if (isOtherProduct) {
        formData.append('other_product', values.otherProduct || '');
      }

      fileList.forEach((file) => {
        if (file.originFileObj) formData.append('files', file.originFileObj);
      });

      await submitQuickCase.mutateAsync(formData);
      messageApi.success('Your quick case request has been submitted. We’ll contact you shortly.');
      form.resetFields();
      setFileList([]);
    } catch (error) {
      console.error(error);
      messageApi.error('Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
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
          disabled={isSubmitting}
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
          <Form.Item name='additionalInfo' label='Additional Information' className='col-span-2'>
            <Input.TextArea rows={2} placeholder='Additional Information' />
          </Form.Item>
          <Form.Item
            name='files'
            label={`Upload Files ${fileList.length > 0 ? `(${fileList.length})` : ''}`}
            className='col-span-2'
            style={{ marginBottom: 0 }}
          >
            <Upload.Dragger
              multiple
              fileList={fileList}
              beforeUpload={() => false}
              onChange={({ fileList }) => setFileList(fileList)}
              accept='.stl,.jpg,.jpeg,.png,.pdf,.zip'
            >
              <p className='flex justify-center pb-2 text-2xl'>
                <AiOutlineInbox />
              </p>
              {/* <p className='ant-upload-text'>Click or drag files to upload (STL, images, PDF, ZIP)</p> */}
              <p className='ant-upload-text'>Click or drag files to upload (STL)</p>
            </Upload.Dragger>
          </Form.Item>
          <Form.Item className='col-span-2'>
            <Divider />
            <Button type='primary' htmlType='submit' block loading={isSubmitting}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
};

export default QuickCaseSubmitPage;

interface QuickCaseFormValues {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  country: string;
  product: string;
  otherProduct?: string;
  anatomy: string;
  surgery_date: Dayjs | string;
  additionalInfo?: string;
}
