import { useRef, useEffect } from 'react';
import ListButton from './ListButton';
import ListPanel from './ListPanel';
import { useItemListPanelStateStore } from '@/store/useItemListPanelStateStore';

const ItemListPanel = () => {
    const { setIsOpen } = useItemListPanelStateStore();
  
  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={panelRef} className='relative'>
      <ListButton />
      <ListPanel />
    </div>
  );
};
export default ItemListPanel;
