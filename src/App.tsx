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
import keycloak from './api/features/keycloak';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchTypeID, selectIdType } from './stores/slices/idType.slice';
import {
  fetchPackageList,
  selectPackageList,
} from './stores/slices/packageList.slice';
import {
  fetchMarketSegmentList,
  selectMarketSegmentList,
} from './stores/slices/marketSegment.slice';
// import { apiUserSearch } from './api/features/systemUser';

const App: React.FC = () => {
  const { locale } = useSelector(state => state.auth);
  const { loading } = useSelector(state => state.global);
  const dispatch = useDispatch();
  const idType = useSelector(selectIdType);
  const packageList = useSelector(selectPackageList);
  const marketSegment = useSelector(selectMarketSegmentList);
  useNProgress({ isLoading: loading, delay: 50 });

  const AUTO_LOGOUT_TIME = 60 * 60 * 1000; //
  const [lastActivity, setLastActivity] = useState(Date.now());

  // useEffect(() => {
  //   const resetTimer = () => setLastActivity(Date.now());

  //   // Bắt sự kiện hoạt động của người dùng
  //   window.addEventListener('mousemove', resetTimer);
  //   window.addEventListener('keydown', resetTimer);
  //   window.addEventListener('scroll', resetTimer);

  //   const interval = setInterval(() => {
  //     if (location.pathname === '/login') {
  //       return;
  //     }
  //     if (Date.now() - lastActivity >= AUTO_LOGOUT_TIME) {
  //       localStorage.clear();
  //       window.location.href = '/login';
  //     }
  //   }, 1000); // Kiểm tra mỗi giây

  //   return () => {
  //     window.removeEventListener('mousemove', resetTimer);
  //     window.removeEventListener('keydown', resetTimer);
  //     window.removeEventListener('scroll', resetTimer);
  //     clearInterval(interval);
  //   };
  // }, []);

  useEffect(() => {
    if (idType.length === 0 && !loading) {
      dispatch(fetchTypeID());
    }
    if (packageList.length === 0 && !loading) {
      dispatch(fetchPackageList());
    }
    if (marketSegment.length === 0 && !loading) {
      dispatch(fetchMarketSegmentList());
    }
  }, [dispatch, idType, loading, packageList, marketSegment]);

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
  const eventLogger = (event: unknown, error: unknown) => {
    console.log('onKeycloakEvent', event, error);
  };

  const tokenLogger = (
    tokens: { token: string; idToken: string; refreshToken: string } | any
  ) => {
    // if (!tokens.token) {
    //   keycloak.login();
    // }
    // if (tokens.token) {
    //   // apiUserInfo();
    // }
    // localStorage.setItem('token', tokens.token);
  };
  return (
    <ConfigProvider locale={getAntdLocale()} componentSize="middle">
      <IntlProvider locale={locale.split('_')[0]}>
        <HistoryRouter history={history}>
          <RenderRouter />
        </HistoryRouter>
      </IntlProvider>
    </ConfigProvider>
  );
};

export default App;
