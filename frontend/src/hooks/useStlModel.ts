import { StlModelContext } from '@/context/StlModelContext';
import { useContext } from 'react';

export const useStlModel = () => {
  const context = useContext(StlModelContext);
  if (!context) {

    throw new Error('useStlModel must be used within an StlModelProvider');
  }
  return context;
};
