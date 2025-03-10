// import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from '@/App.tsx';
import '@/tailwind.css';
import { AuthProvider } from '@/context/AuthContext';
import { ConfigProvider, type ThemeConfig } from 'antd';

const PRIMARY = '#046759';
const PRIMARY_HOVER = '#eef2f1';
const PRIMARY_SELECTED = '#eef2f1';
const PRIMARY_ACTIVE = '#e0eae6';

const customTheme: ThemeConfig = {
  token: { colorPrimary: PRIMARY, colorBgLayout: '#EBF0F3' },
  components: {
    Menu: {
      itemHoverBg: PRIMARY_HOVER,
      itemSelectedBg: PRIMARY_SELECTED,
      itemActiveBg: PRIMARY_ACTIVE,
      colorPrimary: PRIMARY,
    },
  },
};

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <ConfigProvider theme={customTheme}>
    <AuthProvider>
      <App />
    </AuthProvider>
  </ConfigProvider>
  // </StrictMode>
);
