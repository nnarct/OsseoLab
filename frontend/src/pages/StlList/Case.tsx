import StlDisplay from '@/components/feature/StlList/StlDisplay/StlDisplay';
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout, Button } from 'antd';
import { IoIosArrowBack } from 'react-icons/io';

const Case = () => {
  const navigate = useNavigate();
  useEffect(() => {
    console.log('Case component mounted');
  }, []);
  const { id } = useParams();
  if (!id) return <>URL is not correct</>;

  return (
    <div>
      <Layout style={{ minHeight: '100vh' }}>
        <Layout.Header
          className='flex items-center gap-3'
          style={{
            background: '#fff',
            height: '73px',
            padding: '0 24px',
            borderBottom: '1px solid rgba(5, 5, 5, 0.05)',
            borderLeft: '1px solid rgba(5, 5, 5, 0.05)',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
          }}
        >
          <Button onClick={() => navigate(-1)} type='text' icon={<IoIosArrowBack />} style={{ paddingInline: '12px' }}>
            Back
          </Button>
          <span style={{ fontSize: '20px', fontWeight: 'bold' }}>STL Viewer</span>
        </Layout.Header>
        <Layout.Content style={{ background: '#fff', borderLeft: '1px solid rgba(5, 5, 5, 0.05)' }}>
          <StlDisplay id={id} />
        </Layout.Content>
      </Layout>
    </div>
  );
};

export default Case;
