import { Layout } from "antd";

type Props = React.ComponentProps<typeof Layout.Header>;

const CustomHeader = ({ children, ...rest }: Props) => {
  return (
    <Layout.Header
      className='flex items-center'
      style={{
        background: 'white',
        height: '73px',
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
