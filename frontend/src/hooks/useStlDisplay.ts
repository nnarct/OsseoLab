import { StlDisplayContext } from "@/context/StlDisplayContext";
import { useContext } from 'react';

export const useStlDisplay = () => {
  const context = useContext(StlDisplayContext);
  if (!context) {
    throw new Error('useStlDisplay must be used within an StlDisplayProvider');
  }
  return context;
};
