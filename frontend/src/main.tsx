// import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from '@/App.tsx';
import '@/index.css';
import '@/tailwind.css';
import { AuthProvider } from '@/context/AuthContext';
import { ConfigProvider } from 'antd';

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: '#046759', // Set primary color
        colorBgLayout: '#EBF0F3',
      },
    }}
  >
    <AuthProvider>
      <App />
    </AuthProvider>
  </ConfigProvider>
  // </StrictMode>
);
