import { LuLogOut } from 'react-icons/lu';
import { Avatar, Typography, Tooltip, Button } from 'antd';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/user';

const SidebarUserInfo = ({ collapsed }: { collapsed: boolean }) => {
  const { role, user, logout } = useAuth();
  const getRole = () => {
    if (role === UserRole.Admin) return 'Admin';
    if (role === UserRole.Doctor) return 'Doctor';
    if (role === UserRole.Technician) return 'Technician';
  };

  return (
    <div className='sticky bottom-0 z-10 border-t border-gray-100 bg-white'>
      <div className='mx-2 mt-2 mb-4 flex items-center gap-x-2 rounded-md bg-[#FAFAFA] p-3'>
        <Avatar className='min-w-8'>{role ? role[0].toUpperCase() : ''}</Avatar>

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
    </div>
  );
};
export default SidebarUserInfo;
