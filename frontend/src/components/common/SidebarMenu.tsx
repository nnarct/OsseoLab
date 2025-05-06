import { Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { FaUserFriends, FaRegImages, FaChartBar, FaListUl, FaPlusCircle, FaRegFolderOpen } from 'react-icons/fa';
import { TfiEmail } from 'react-icons/tfi';
import { useEffect, useState } from 'react';
import { VscBell, VscBellDot } from 'react-icons/vsc';
import { useHasUnreadNotification } from '@/services/notification/notification.service';

const SidebarMenu = () => {
  const { role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const { data: hasUnread } = useHasUnreadNotification();

  // Define menu items
  const adminMenu = [
    {
      key: '/notifications',
      label: 'Notifications',
      icon: hasUnread ? <VscBellDot /> : <VscBell />,
      onClick: () => navigate('/notifications'),
    },
    { key: '/', label: 'Dashboard', icon: <FaChartBar />, onClick: () => navigate('/') },
    {
      key: 'userlist',
      label: 'User List',
      icon: <FaUserFriends />,
      children: [
        { key: '/user/list', label: 'User List', onClick: () => navigate('/user/list') },
        { key: '/admin/list', label: 'Admin List', onClick: () => navigate('/admin/list') },
        { key: '/technician/list', label: 'Technician List', onClick: () => navigate('/technician/list') },
        { key: '/doctor/list', label: 'Surgeons List', onClick: () => navigate('/doctor/list') },
      ],
    },
    {
      key: 'case',
      label: 'Cases',
      icon: <FaRegFolderOpen />,
      children: [
        { key: '/case/list', icon: <FaListUl />, label: 'Case List', onClick: () => navigate('/case/list') },
        { key: '/case/create', icon: <FaPlusCircle />, label: 'Create Case', onClick: () => navigate('/case/create') },
        {
          key: '/case/quick-case',
          icon: <TfiEmail />,
          label: 'Quick Case List',
          onClick: () => navigate('/case/quick-case'),
        },
      ],
    },
  ];

  const techMenu = [
    {
      key: '/notifications',
      label: 'Notifications',
      icon: hasUnread ? <VscBellDot style={{ color: '#fa541c' }} /> : <VscBell />,
      onClick: () => navigate('/notifications'),
    },
    {
      key: '/',
      label: 'Homepage',
      icon: <FaRegImages />,
      onClick: () => navigate('/'),
    },
    {
      key: 'case',
      label: 'Cases',
      icon: <FaRegFolderOpen />,
      children: [
        { key: '/case/list', icon: <FaListUl />, label: 'Case List', onClick: () => navigate('/case/list') },
        { key: '/case/create', icon: <FaPlusCircle />, label: 'Create Case', onClick: () => navigate('/case/create') },
      ],
    },
  ];

  const doctorMenu = [
    {
      key: '/',
      label: 'Homepage',
      icon: <FaRegImages />,
      onClick: () => navigate('/'),
    },
    { key: '/case/list', icon: <FaRegFolderOpen />, label: 'Case List', onClick: () => navigate('/case/list') },
  ];

  const menuItems = { admin: adminMenu, technician: techMenu, doctor: doctorMenu };

  // Set selected key based on the current location
  useEffect(() => {
    setSelectedKeys([location.pathname]); // Updates the selected key when route changes
  }, [location.pathname]);

  if (!role) return null;

  return (
    <div className='flex-1 p-2 text-gray-400'>
      <Menu mode='inline' theme='light' selectedKeys={selectedKeys} items={menuItems[role]} className='!border-none' />
    </div>
  );
};

export default SidebarMenu;
