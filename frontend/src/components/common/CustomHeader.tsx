import { Button, Layout } from 'antd';
import { IoIosArrowBack } from 'react-icons/io';
import { type To, useNavigate } from 'react-router-dom';

type Props = React.ComponentProps<typeof Layout.Header>;
type HeaderWithBackProps = Props & { backTo?: To | number };

const CustomHeader = ({ children, backTo, ...rest }: HeaderWithBackProps) => {
  if (backTo) {
    return <HeaderWithBack backTo={backTo as To} />;
  }

  return (
    <Layout.Header
      className='flex items-center'
      style={{
        background: 'white',
        position: 'sticky',
        height: '73px',
        top: 0,
        zIndex: 1000,
        padding: '0 24px',
        borderBottom: '1px solid rgba(5, 5, 5, 0.05)',
        borderLeft: '1px solid rgba(5, 5, 5, 0.05)',
        ...(rest.style || {}),
      }}
      {...rest}
    >
      {children}
    </Layout.Header>
  );
};

export default CustomHeader;

const HeaderWithBack = ({ children, backTo, ...rest }: HeaderWithBackProps) => {
  const navigate = useNavigate();
  return (
    <Layout.Header
      className='flex items-center'
      style={{
        background: 'white',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        height: '73px',
        padding: '0 24px',
        borderBottom: '1px solid rgba(5, 5, 5, 0.05)',
        borderLeft: '1px solid rgba(5, 5, 5, 0.05)',
        ...(rest.style || {}),
      }}
      {...rest}
    >
      <Button
        onClick={() => navigate(backTo as To)}
        type='text'
        icon={<IoIosArrowBack />}
        style={{ padding: '0 16px 0 0' }}
      >
        Back
      </Button>
      {children}
    </Layout.Header>
  );
};
