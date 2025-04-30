import { Button, Tooltip } from 'antd';
import type { ButtonProps } from 'antd';
import React, { isValidElement, cloneElement } from 'react';

type MenuButtonProps = ButtonProps & { tooltip?: string; text?: string };

const MenuButton: React.FC<MenuButtonProps> = ({ tooltip, icon, text, ...props }) => {
  const iconWithSize = isValidElement(icon) ? cloneElement(icon, { size: 24 }) : icon;

  const buttonContent = (
    <Button
      {...props}
      type={props.type}
      size='large'
      onClick={props.onClick}
      disabled={props.disabled}
      style={{ width: 64, padding: '24px 8px', ...props.style }}
    >
      <div className='flex flex-col items-center gap-0'>
        {iconWithSize}
        <span style={{ fontSize: 10, fontWeight: 600, lineHeight: 1.5 }}>{text}</span>
      </div>
    </Button>
  );

  return tooltip ? <Tooltip title={tooltip}>{buttonContent}</Tooltip> : buttonContent;
};

export default MenuButton;
