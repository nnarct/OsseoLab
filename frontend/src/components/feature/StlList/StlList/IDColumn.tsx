import { useState } from "react";
import { Tooltip, Button } from "antd";
import { IoMdCheckmark, IoMdCopy } from "react-icons/io";

type Props = { id: string };
const IDColumn = ({ id }: Props) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  

  const handleCopyId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      setCopiedId(id);

      setTimeout(() => setCopiedId(null), 1500);
    } catch (error) {
      console.error('Failed to copy ID:', error);
    }
  };

  return (
    <div className='flex items-center space-x-1'>
      <span className='whitespace-nowrap'>{id}</span>
      <Tooltip title={copiedId === id ? 'Copied!' : 'Copy'}>
        <Button
          type='text'
          icon={copiedId === id ? <IoMdCheckmark style={{ color: 'green' }} /> : <IoMdCopy />}
          onClick={() => handleCopyId(id)}
        />
      </Tooltip>
    </div>
  );
};

export default IDColumn;
