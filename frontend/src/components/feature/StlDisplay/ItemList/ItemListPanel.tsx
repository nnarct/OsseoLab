import { useRef, useEffect } from 'react';
import ListButton from './ListButton';
import ListPanel from './ListPanel';
import { useItemListPanelStateStore } from '@/store/useItemListPanelStateStore';

const ItemListPanel = () => {
  const { setIsOpen } = useItemListPanelStateStore();

  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (panelRef.current && panelRef.current.contains(target)) return;

      const popup = document.querySelector('.ant-popover');
      if (popup && popup.contains(target)) return;
      setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setIsOpen]);

  return (
    <div ref={panelRef} className='relative'>
      <ListButton />
      <ListPanel />
    </div>
  );
};
export default ItemListPanel;
