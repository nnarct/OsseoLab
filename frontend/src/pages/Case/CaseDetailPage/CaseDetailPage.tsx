import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Result, Spin } from 'antd';
import { axios } from '@/config/axiosConfig';
import { useAuth } from '@/hooks/useAuth';
import CaseDetailPageAdmin from './CaseDetailPageAdmin';
import CaseDetailPageDoctor from './CaseDetailPageDoctor';
import CaseDetailTechnicianPage from './CaseDetailPageTechnician';
import CustomHeader from '@/components/common/CustomHeader';

const CaseDetailPage = () => {
  const { role } = useAuth();
  const { id } = useParams();
  const [caseExists, setCaseExists] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      setCaseExists(false);
    }
    const checkCase = async () => {
      try {
        const res = await axios.get(`/case/${id}/exists`);
        if (res.data.exists) {
          setCaseExists(true);
        } else {
          setCaseExists(false);
        }
      } catch {
        setCaseExists(false);
      }
    };
    if (id) {
      checkCase();
    }
  }, [id]);

  if (!id) {
    return;
  }
  if (caseExists === null)
    return (
      <>
        <CustomHeader backTo={'/case/list'}>
          <p className='pl-2 text-2xl font-bold'>Case Information</p>
        </CustomHeader>
        <div
          className='flex items-center justify-center bg-white'
          style={{ height: 'calc(100vh - 115px)', borderLeft: '1px solid rgba(5, 5, 5, 0.05)' }}
        >
          <Spin size='large' />
        </div>
      </>
    );
  if (caseExists === false || !id)
    return (
      <>
        <CustomHeader backTo={'/case/list'}>
          <p className='pl-2 text-2xl font-bold'>Case Information</p>
        </CustomHeader>
        <div
          className='flex items-center justify-center bg-white'
          style={{ height: 'calc(100vh - 115px)', borderLeft: '1px solid rgba(5, 5, 5, 0.05)' }}
        >
          <Result
            status='404'
            title='404'
            subTitle='Case not found.'
            extra={
              <Button type='primary' onClick={() => navigate(`/case/list`)}>
                Back To Case List
              </Button>
            }
          />
        </div>
      </>
    );

  if (role === 'admin') {
    return (
      <>
        <CustomHeader backTo={'/case/list'}>
          <p className='pl-2 text-2xl font-bold'>Case Information</p>
        </CustomHeader>
        <CaseDetailPageAdmin id={id} />
      </>
    );
  }
  if (role === 'doctor') {
    return (
      <>
        <CustomHeader backTo={'/case/list'}>
          <p className='pl-2 text-2xl font-bold'>Case Information</p>
        </CustomHeader>
        <CaseDetailPageDoctor id={id} />
      </>
    );
  }
  if (role === 'technician') {
    return (
      <>
        <CustomHeader backTo={'/case/list'}>
          <p className='pl-2 text-2xl font-bold'>Case Information</p>
        </CustomHeader>
        <CaseDetailTechnicianPage id={id} />
      </>
    );
  }
  return <div>No access</div>;
};

export default CaseDetailPage;
