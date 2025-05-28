import { useState } from 'react';
import { useCaseFilesByCaseId } from '@/services/case/case-files.service';
import CaseFilesTable from './CaseFilesTable';
import UploadFileModal from './UploadFileModal';

const CaseFilesList = ({ caseId, readOnly }: { caseId: string; readOnly?: boolean }) => {
  const { data: filesData, isLoading } = useCaseFilesByCaseId(caseId);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  if (!isLoading) {
    return (
      <>
        <CaseFilesTable caseId={caseId} filesData={filesData} readOnly={readOnly} openModal={openModal} />
        <UploadFileModal isOpen={isOpen} onClose={closeModal} caseId={caseId} />
      </>
    );
  }
};

export default CaseFilesList;
