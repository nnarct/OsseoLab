import CaseFilesList from '@/components/feature/Case/CaseFilesList';
import { useGetCaseById } from '@/services/case/case.service';
import { Button, Card, Descriptions, Divider } from 'antd';
import dayjs from 'dayjs';
import { FaRegEdit } from 'react-icons/fa';

const CaseDetailDoctor = ({
  id,
  setIsEditing,
}: {
  id: string;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { data, isLoading } = useGetCaseById(id);

  const {
    surgeon,
    patient_name,
    patient_gender,
    patient_dob,
    patient_age: original_age,
    surgery_date,
    scan_type,
    additional_note,
    problem_description,
    priority,
    case_number,
    status,
    product,
    anticipated_ship_date,
    created_by,
    created_at,
    case_code,
  } = data ? data : {};

  return (
    <Card
      loading={isLoading}
      title={
        <div className='flex justify-between'>
          {`CASE${data ? String(case_number).padStart(3, '0') : ''} `}{' '}
          <Button onClick={() => setIsEditing(true)} icon={<FaRegEdit />}>
            Edit
          </Button>
        </div>
      }
    >
      {data ? (
        <>
          <Descriptions
            bordered
            column={{ xs: 1, md: 1, lg: 2 }}
            styles={{ label: { whiteSpace: 'nowrap', width: '180px' } }}
          >
            <Descriptions.Item label='Case ID'>{id ? String(case_number).padStart(3, '0') : '-'}</Descriptions.Item>
            <Descriptions.Item label='Case Code'>{case_code}</Descriptions.Item>
            <Descriptions.Item label='Surgeon'>
              {surgeon?.firstname} {surgeon?.lastname}
            </Descriptions.Item>
            <Descriptions.Item label='Patient Name'>{patient_name}</Descriptions.Item>
            <Descriptions.Item label='Patient Gender'>{patient_gender || '-'}</Descriptions.Item>
            <Descriptions.Item label='Patient DOB / Age'>
              {patient_dob ? dayjs(patient_dob * 1000).format('DD MMM YYYY') : '-'} / {original_age ?? '-'}
            </Descriptions.Item>
            <Descriptions.Item label='Surgery Date'>
              {surgery_date ? dayjs(surgery_date * 1000).format('DD MMM YYYY') : '-'}
            </Descriptions.Item>
            <Descriptions.Item label='Anticipated Ship Date'>
              {anticipated_ship_date ? dayjs(anticipated_ship_date * 1000).format('DD MMM YYYY') : '-'}
            </Descriptions.Item>
            <Descriptions.Item label='Scan Type'>{scan_type}</Descriptions.Item>
            <Descriptions.Item label='Product'>{product || '-'}</Descriptions.Item>
            <Descriptions.Item label='Problem Description' span={2}>
              {problem_description || '-'}
            </Descriptions.Item>
            <Descriptions.Item label='Additional Note' span={2}>
              {additional_note || '-'}
            </Descriptions.Item>
            <Descriptions.Item label='Priority'>{priority}</Descriptions.Item>
            <Descriptions.Item label='Status'>{status}</Descriptions.Item>
            <Descriptions.Item label='Created By'>
              {created_by?.firstname} {created_by?.lastname}
            </Descriptions.Item>
            <Descriptions.Item label='Created At'>
              {created_at ? dayjs(created_at * 1000).format('DD MMM YYYY hh:mm A') : '-'}
            </Descriptions.Item>
          </Descriptions>
          <Divider />
          <CaseFilesList caseId={id} readOnly />
        </>
      ) : (
        <></>
      )}
    </Card>
  );
};

export default CaseDetailDoctor;
