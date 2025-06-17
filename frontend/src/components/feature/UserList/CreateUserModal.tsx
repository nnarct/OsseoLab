import { COUNTRIES } from '@/constants/option';
import type { CreateUserFormData, CreateUserPayloadData } from '@/types/user';
import { Button, Modal, Form, Input, Select, DatePicker, notification } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { FaUserPlus } from 'react-icons/fa';
import { useCreateUser } from '@/services/user/user.service';
import { AxiosError } from 'axios';

const CreateUserModal: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [form] = Form.useForm<CreateUserFormData>();
  const [notificationApi, contextHolder] = notification.useNotification();

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const { mutateAsync: createUserAsync, isPending } = useCreateUser();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (values.dob && typeof values.dob !== 'string') {
        values.dob = values.dob.format('YYYY-MM-DD');
      }
      const payload: CreateUserPayloadData = {
        firstname: values.firstname,
        lastname: values.lastname,
        username: values.newUsername,
        email: values.newEmail,
        phone: values.phone,
        role: values.role,
        gender: values.gender,
        dob: values.dob,
        password: values.newPassword,
        country: values.country,
      };
      await createUserAsync(payload);

      notificationApi.success({
        message: 'User created successfully',
        placement: 'top',
      });
      form.resetFields();
      closeModal();
    } catch (error) {
      const hasValidationError = form.getFieldsError().some((field) => field.errors.length > 0);

      if (!hasValidationError) {
        notificationApi.error({
          message: 'Failed to create user',
          description: error instanceof AxiosError ? error.response?.data.message : 'An unknown error occurred',
          placement: 'top',
        });
      }
    }
  };

  return (
    <div {...props}>
      {contextHolder}
      <Button onClick={openModal} icon={<FaUserPlus />} type='primary'>
        Add User
      </Button>
      <Modal
        open={isOpen}
        onCancel={closeModal}
        onOk={handleSubmit}
        destroyOnClose
        okText='Add'
        title='Create New User'
        confirmLoading={isPending}
      >
        <Form form={form} layout='vertical' className='grid grid-cols-2 gap-x-4'>
          <Form.Item
            name='firstname'
            label='First Name'
            rules={[{ required: true, message: 'First name is required' }]}
          >
            <Input placeholder='Enter user first name' allowClear />
          </Form.Item>
          <Form.Item name='lastname' label='Last Name' rules={[{ required: true, message: 'Last name is required' }]}>
            <Input placeholder='Enter user last name' allowClear />
          </Form.Item>
          <Form.Item name='newUsername' label='Username' rules={[{ required: true, message: 'Username is required' }]}>
            <Input placeholder='Enter user username' type='text'  autoComplete='new-username'/>
          </Form.Item>
          <Form.Item name='newEmail' label='Email' rules={[{ required: true, message: 'Email is required' }]}>
            <Input placeholder='Enter user email address' type='email' autoComplete='off' />
          </Form.Item>
          <Form.Item
            name='phone'
            label='Mobile Number'
            rules={[{ pattern: /^[0-9]{10}$/, message: 'Please enter a valid mobile number' }]}
          >
            <Input max={10} placeholder='Enter user mobile number' type='text' allowClear />
          </Form.Item>
          <Form.Item name='role' label='Role' rules={[{ required: true, message: 'Role is required' }]}>
            <Select
              placeholder='Select user role'
              options={[
                { value: 'admin', label: 'Admin' },
                { value: 'doctor', label: 'Doctor' },
                { value: 'technician', label: 'Technician' },
              ]}
            />
          </Form.Item>
          <Form.Item name='country' label='Country'>
            <Select showSearch placeholder='Select user country' options={COUNTRIES} allowClear />
          </Form.Item>
          <Form.Item name='gender' label='Gender'>
            <Select
              placeholder='Select user gender'
              options={[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
                { value: 'other', label: 'Other' },
              ]}
            />
          </Form.Item>
          <Form.Item name='dob' label='Date of Birth'>
            <DatePicker
              maxDate={dayjs()}
              format='DD-MM-YYYY'
              className='w-full'
              placeholder='Enter user date of birth'
              type='text'
              allowClear
            />
          </Form.Item>
          <Form.Item name='newPassword' label='Password' rules={[{ required: true, message: 'Password is required' }]}>
            <Input.Password placeholder='Enter user password' autoComplete='new-password'/>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CreateUserModal;
