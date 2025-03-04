/* eslint-disable @typescript-eslint/no-unused-vars */
import { Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { FaUserFriends, FaUsers, FaUserTie, FaUserCog, FaRegImages } from 'react-icons/fa';
import { FaUserDoctor } from 'react-icons/fa6';
// import { UserRole } from '@/constants/roles';
// import { AppstoreOutlined, UserOutlined } from '@ant-design/icons';

const SidebarMenu = () => {
  const { role } = useAuth();
  const navigate = useNavigate();

  // Define menu items
  const adminMenu = [
    {
      key: 'stl-list',
      label: 'STL List',
      icon: <FaRegImages />,
      onClick: () => navigate('/'),
    },
    {
      key: 'userlist',
      label: 'User List',
      icon: <FaUserFriends />,
      children: [
        { key: 'user-list', label: 'User List', onClick: () => navigate('/user/list') },
        { key: 'admin-list', label: 'Admin List', onClick: () => navigate('/admin/list') },
        {
          key: 'technician-list',

          label: 'Technician List',
          onClick: () => navigate('/technician/list'),
        },
        { key: 'doctor-list', label: 'Doctor List', onClick: () => navigate('/doctor/list') },
      ],
    },
  ];

  const techMenu = [
    {
      key: 'homepage',
      label: 'Homepage',
      icon: <FaRegImages />,
      onClick: () => navigate('/'),
    },
  ];
  const doctorMenu = [
    {
      key: 'homepage',
      label: 'Homepage',
      icon: <FaRegImages />,
      onClick: () => navigate('/'),
    },
  ];
  const menuItems = { admin: adminMenu, tech: techMenu, doctor: doctorMenu };

  if (role)
    return (
      <div className='flex-1 p-3 text-gray-400'>
        <Menu mode='inline' theme='light' items={menuItems[role]} className='!border-none' />
      </div>
    );
};

export default SidebarMenu;
