import { COUNTRIES } from '@/constants/option';
import type { CreateDoctorFormData } from '@/types/user';
import { Button, Modal, Form, Input, Select, DatePicker, notification } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { FaUserPlus } from 'react-icons/fa';
import { useCreateTechUser } from '@/services/user/user.service';

const CreateTechModal: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [form] = Form.useForm<CreateDoctorFormData>();
  const [notificationApi, contextHolder] = notification.useNotification();

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const { mutateAsync, isPending } = useCreateTechUser();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (values.dob && typeof values.dob !== 'string') {
        values.dob = values.dob.format('YYYY-MM-DD');
      }
      await mutateAsync(values);

      notificationApi.success({
        message: 'Technician created successfully',
        placement: 'top',
      });
      closeModal();
    } catch (error) {
      const hasValidationError = form.getFieldsError().some((field) => field.errors.length > 0);

      if (!hasValidationError) {
        notificationApi.error({
          message: 'Failed to create technician',
          description: error instanceof Error ? error.message : 'An unknown error occurred',
          placement: 'top',
        });
      }
    }
  };

  return (
    <div {...props}>
      {contextHolder}
      <Button onClick={openModal} icon={<FaUserPlus />} type='primary'>
        Add Technician
      </Button>
      <Modal
        open={isOpen}
        onCancel={closeModal}
        onOk={handleSubmit}
        destroyOnClose
        okText='Add'
        title='Create New Technician'
        confirmLoading={isPending}
      >
        <Form form={form} layout='vertical' className='grid grid-cols-2 gap-x-4'>
          <Form.Item name='firstname' label='First Name' rules={[{ required: true, message: 'First name is required' }]}>
            <Input placeholder='Enter technician first name' allowClear />
          </Form.Item>
          <Form.Item name='lastname' label='Last Name' rules={[{ required: true, message: 'Last name is required' }]}>
            <Input placeholder='Enter technician last name' allowClear />
          </Form.Item>
          <Form.Item name='username' label='Username' rules={[{ required: true, message: 'Username is required' }]}>
            <Input placeholder='Enter technician username' type='text' />
          </Form.Item>
          <Form.Item name='email' label='Email' rules={[{ required: true, message: 'Email is required' }]}>
            <Input placeholder='Enter technician email address' type='email' />
          </Form.Item>
          <Form.Item name='phone' label='Mobile Number' rules={[{ pattern: /^[0-9]{10}$/, message: 'Please enter a valid mobile number' }]}>
            <Input max={10} placeholder='Enter technician mobile number' type='text' allowClear />
          </Form.Item>
          <Form.Item name='country' label='Country'>
            <Select showSearch placeholder='Select technician country' options={COUNTRIES} allowClear />
          </Form.Item>
          <Form.Item name='gender' label='Gender'>
            <Select
              placeholder='Select technician gender'
              options={[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
                { value: 'other', label: 'Other' },
              ]}
            />
          </Form.Item>
          <Form.Item name='dob' label='Date of Birth'>
            <DatePicker maxDate={dayjs()} format='DD-MM-YYYY' className='w-full' placeholder='Enter technician date of birth' type='text' allowClear />
          </Form.Item>
          <Form.Item name='password' label='Password' rules={[{ required: true, message: 'Password is required' }]}>
            <Input.Password placeholder='Enter technician password' />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CreateTechModal