/* eslint-disable @typescript-eslint/no-unused-vars */
import { Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { FaUserFriends, FaRegImages } from 'react-icons/fa';
import { useEffect, useState } from 'react';

const SidebarMenu = () => {
  const { role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  // Define menu items
  const adminMenu = [
    {
      key: '/',
      label: 'STL List',
      icon: <FaRegImages />,
      onClick: () => navigate('/'),
    },
    {
      key: 'userlist',
      label: 'User List',
      icon: <FaUserFriends />,
      children: [
        { key: '/user/list', label: 'User List', onClick: () => navigate('/user/list') },
        { key: '/admin/list', label: 'Admin List', onClick: () => navigate('/admin/list') },
        { key: '/technician/list', label: 'Technician List', onClick: () => navigate('/technician/list') },
        { key: '/doctor/list', label: 'Doctor List', onClick: () => navigate('/doctor/list') },
      ],
    },
  ];

  const techMenu = [
    {
      key: '/',
      label: 'Homepage',
      icon: <FaRegImages />,
      onClick: () => navigate('/'),
    },
  ];

  const doctorMenu = [
    {
      key: '/',
      label: 'Homepage',
      icon: <FaRegImages />,
      onClick: () => navigate('/'),
    },
  ];

  const menuItems = { admin: adminMenu, tech: techMenu, doctor: doctorMenu };

  // Set selected key based on the current location
  useEffect(() => {
    setSelectedKeys([location.pathname]); // Updates the selected key when route changes
  }, [location.pathname]);

  if (!role) return null;

  return (
    <div className='flex-1 p-2 text-gray-400'>
      <Menu
        mode='inline'
        theme='light'
        selectedKeys={selectedKeys}
        items={menuItems[role]}
        className='!border-none'
      />
    </div>
  );
};

export default SidebarMenu;
