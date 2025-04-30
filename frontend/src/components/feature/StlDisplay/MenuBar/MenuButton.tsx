import { Button, Tooltip } from 'antd';
import type { ButtonProps } from 'antd';
import React from 'react';
import styled from 'styled-components';

type MenuButtonProps = ButtonProps & { tooltip?: string; text?: string };

const MenuButton: React.FC<MenuButtonProps> = ({ tooltip, icon, text, ...props }) => {
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
        {icon}
        <span style={{ fontSize: 10, fontWeight: 600, lineHeight: 1.5 }}>{text}</span>
      </div>
    </Button>
  );

  return tooltip ? <Tooltip title={tooltip}>{buttonContent}</Tooltip> : buttonContent;
};

export default MenuButton;
