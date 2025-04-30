import {} from 'react';
import { LuLogOut } from 'react-icons/lu';
import { Avatar, Typography, Tooltip, Button, Dropdown, type MenuProps } from 'antd';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/user';
import { useNavigate } from 'react-router-dom';
import { IoSettingsSharp } from 'react-icons/io5';

const SidebarUserInfo = ({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { role, user, logout } = useAuth();
  const navigate = useNavigate();

  const getRole = () => {
    if (role === UserRole.Admin) return 'Admin';
    if (role === UserRole.Doctor) return 'Doctor';
    if (role === UserRole.Technician) return 'Technician';
  };

  const onClick: MenuProps['onClick'] = ({ key }) => {
    if (key === '1') {
      navigate('/profile');
    } else if (key === '2') {
      logout();
    }
  };

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: 'My Account',
      extra: <IoSettingsSharp />,
    },
    { key: '2', label: 'Logout', extra: <LuLogOut /> },
  ];

  return (
    <div className='sticky bottom-0 z-10 border-t border-gray-100 bg-white'>
      {collapsed ? (
        <div
          onClick={() => setCollapsed(false)}
          className={`mx-2 mt-2 mb-4 flex cursor-pointer items-center rounded-md bg-[#FAFAFA] p-3 transition-all duration-200 ease-in-out`}
        >
          <Avatar className='min-w-8 cursor-pointer'>{user?.firstname ? user?.firstname[0].toUpperCase() : ''}</Avatar>
          <div
            className={`flex origin-left items-center overflow-hidden transition-all duration-300 ${
              collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
            }`}
          >
            <div className='w-22'>
              <Typography.Paragraph ellipsis={true} className='maw-w-fit !mb-0 text-sm'>
                {user?.firstname} {user?.lastname[0]}.
              </Typography.Paragraph>
              <p className='text-primary text-xs'>{getRole()}</p>
            </div>
            <Tooltip title={'Logout'}>
              <Button size='small' color='primary' type='text' onClick={logout} icon={<LuLogOut />}></Button>
            </Tooltip>
          </div>
        </div>
      ) : (
        <Dropdown menu={{ items, onClick }} arrow={{ pointAtCenter: true }} placement='top'>
          <div
            className={`ring-primary/40 linear mx-2 mt-2 mb-4 flex cursor-pointer items-center gap-x-2 rounded-md bg-[#FAFAFA] p-3 transition-[box-shadow,transform,box-shadow,ring] delay-200 duration-200 hover:shadow-md hover:ring-2`}
          >
            <Avatar className='min-w-8 cursor-pointer'>{user?.firstname ? user?.firstname[0].toUpperCase() : ''}</Avatar>
            <div
              className={`flex origin-left items-center overflow-hidden transition-all duration-300 ${
                collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
              }`}
            >
              <div className='w-22'>
                <Typography.Paragraph ellipsis={true} className='maw-w-fit !mb-0 text-sm'>
                  {user?.firstname} {user?.lastname[0]}.
                </Typography.Paragraph>
                <p className='text-primary text-xs'>{getRole()}</p>
              </div>
              <Tooltip title={'Logout'}>
                <Button size='small' color='primary' type='text' onClick={logout} icon={<LuLogOut />}></Button>
              </Tooltip>
            </div>
          </div>
        </Dropdown>
      )}
    </div>
  );
};
export default SidebarUserInfo;
