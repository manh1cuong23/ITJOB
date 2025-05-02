import React, { useEffect, useState } from 'react';
import { IntlProvider } from 'react-intl';
import { ConfigProvider } from 'antd';
import enUS from 'antd/es/locale/en_US';
import viVN from 'antd/es/locale/vi_VN';
import moment from 'moment';
import 'moment/locale/vi';
import RenderRouter from './routes';
import { useSelector } from 'react-redux';
import { history, HistoryRouter } from '@/routes/history';
import useNProgress from './hooks/useNProgress';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { SocketProvider } from './api/socket/SocketContext';
// import { apiUserSearch } from './api/features/systemUser';

const App: React.FC = () => {
  const { locale } = useSelector(state => state.auth);
  const { loading } = useSelector(state => state.global);
  const dispatch = useDispatch();
  useNProgress({ isLoading: loading, delay: 50 });

  const AUTO_LOGOUT_TIME = 60 * 60 * 1000; //
  const [lastActivity, setLastActivity] = useState(Date.now());

  useEffect(() => {
    if (locale === 'en_US') {
      moment.locale('en');
    } else if (locale === 'vi_VN') {
      moment.locale('vi');
    }
  }, [locale]);

  const getAntdLocale = () => {
    if (locale === 'en_US') {
      return enUS;
    } else if (locale === 'vi_VN') {
      return viVN;
    }
  };
  const accessToken = localStorage.getItem('token'); // hoặc từ redux/context
  const eventLogger = (event: unknown, error: unknown) => {
    console.log('onKeycloakEvent', event, error);
  };

  const tokenLogger = (
    tokens: { token: string; idToken: string; refreshToken: string } | any
  ) => {};
  return (
    <SocketProvider accessToken={accessToken || ''}>
      <ConfigProvider locale={getAntdLocale()} componentSize="middle">
        <IntlProvider locale={locale.split('_')[0]}>
          <HistoryRouter history={history}>
            <RenderRouter />
          </HistoryRouter>
        </IntlProvider>
      </ConfigProvider>
    </SocketProvider>
  );
};

export default App;
