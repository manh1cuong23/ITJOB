import { FC, Suspense } from 'react';
import { Layout } from 'antd';
import './index.less';
import HeaderComponent from '../header';

import { Outlet } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { setUserItem } from '@/stores/slices/auth.slice';
import SideBar from '../sidebar';
const { Content } = Layout;

const LayoutPage: FC = () => {
  const { collapsed } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const toggle = () => {
    dispatch(
      setUserItem({
        collapsed: !collapsed,
      })
    );
  };
  return (
    <Layout className="layout-page">
      {/* <SideBar /> */}
      <Layout>
        <HeaderComponent collapsed={collapsed} toggle={toggle} />
        <Content className="layout-page-content">
          <Suspense fallback={null}>
            <Outlet />
          </Suspense>
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutPage;
