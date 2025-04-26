// import { Upload, Button, message, Input, Form, Modal, Typography } from 'antd';

// import axios from '@/config/axiosConfig';
// import { useState } from 'react';
// import { TiUploadOutline } from 'react-icons/ti';

// const StlUploader = () => {
//   // const [nickname, setNickname] = useState("");
//   const [file, setFile] = useState<File | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
//   const [form] = Form.useForm();
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const handleSubmit = async (values: any) => {
//     const nickname = values.nickname;
//     if (!nickname.trim()) {
//       message.error('Please enter a nickname for the file!');
//       return;
//     }
//     if (!file) {
//       message.error('Please select an STL file!');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('nickname', nickname);

//     try {
//       setLoading(true);
//       const response = await axios.post('/upload', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });

//       message.success(`File "${nickname}" uploaded successfully!`);
//       console.log('Uploaded:', response.data);
//       setFile(null);
//     } catch (error) {
//       message.error('Upload failed!');
//       console.error(error);
//     } finally {
//       closeModal();
//       setLoading(false);
//     }
//   };

//   const openModal = () => setIsModalOpen(true);
//   const closeModal = () => setIsModalOpen(false);

//   return (
//     <>
//       <Button type='primary' onClick={openModal}>
//         Add STL file
//       </Button>
//       <Modal centered footer={null} open={isModalOpen} destroyOnClose onCancel={closeModal} onClose={closeModal}>
//         <Typography.Title level={3}>Add new STL file</Typography.Title>
//         <Form form={form} onFinish={handleSubmit} requiredMark='optional' disabled={loading}>
//           <Form.Item name='nickname' label='File name' rules={[{ required: true, message: 'Please enter file name.' }]}>
//             <Input placeholder='Enter file name' />
//           </Form.Item>
//           <Form.Item label='Select STL File' name={'stl'} rules={[{ required: true, message: 'Please Upload file.' }]}>
//             <Upload
//               beforeUpload={(file) => {
//                 setFile(file);
//                 return false;
//               }}
//               maxCount={1}
//               accept='.stl'
//             >
//               <Button icon={<TiUploadOutline />}>Upload STL File</Button>
//             </Upload>
//           </Form.Item>
//           <div className='flex justify-center gap-6'>
//             <Button onClick={closeModal}>Cancel</Button>
//             <Button type='primary' htmlType='submit' loading={loading}>
//               Submit
//             </Button>
//           </div>
//         </Form>
//       </Modal>
//     </>
//   );
// };

// export default StlUploader;
