import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import './styles/index.less';
import './styles/main.less';
import store from './stores';
import { Provider } from 'react-redux';
import App from './App';
import { ConfigProvider } from 'antd';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import queryClient from './api/configs/react-query';

const theme = {
  token: {
    colorPrimary: '#D92D20', // Màu chủ đạo
    colorLink: '#D92D20', // Màu liên kết
  },
};
const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(
  <Provider store={store}>
  <QueryClientProvider client={queryClient}>
    <ConfigProvider theme={theme}>
      <App />
    </ConfigProvider>
  </QueryClientProvider>
</Provider>
);
