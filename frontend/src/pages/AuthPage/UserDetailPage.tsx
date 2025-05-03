import CustomHeader from '@/components/common/CustomHeader';
import UserDetail from '@/components/feature/UserList/UserDetail';
import { Layout } from 'antd';
import { useParams } from 'react-router-dom';

const UserDetailPage = () => {
  const { id } = useParams();
  return (
    <>
      <CustomHeader>
        <p className='text-2xl font-bold'>User Information</p>
      </CustomHeader>
      <Layout.Content className='p-4'> {id ? <UserDetail id={id} /> : <>User id is missing</>}</Layout.Content>
    </>
  );
};

export default UserDetailPage;
