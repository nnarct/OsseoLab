import { Html, useProgress } from '@react-three/drei';
import { Progress } from 'antd';

const Loader = () => {
  const { progress } = useProgress();

  return (
    <Html center>
      <Progress type='circle' percent={Math.floor(progress)} />
    </Html>
  );
};

export default Loader;
