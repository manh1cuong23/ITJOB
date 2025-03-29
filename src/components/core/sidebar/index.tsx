import { useEffect, useCallback, useState } from 'react';
import { Layout } from 'antd';
import '../layout/index.less';
import { getGlobalState } from '@/utils/getGloabal';

import { useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { getFirstPathCode } from '@/utils/getFirstPathCode';
import { MenuList } from '@/interface/layout/menu.interface';
import { mockMenuList } from '@/mocks/menu';
import { setUserItem } from '@/stores/slices/auth.slice';
import { Link } from 'react-router-dom';
import Union from '/logo.png';
import Union2 from '/logoSmall.png';
import MenuComponent from './menu';
const { Sider, Content } = Layout;
const WIDTH = 992;

const SideBar = () => {
  const location = useLocation();
  const [openKey, setOpenkey] = useState<string>();
  const [selectedKey, setSelectedKey] = useState<string>(location.pathname);
  const { device, collapsed } = useSelector(state => state.auth);
  const [menuList, setMenuList] = useState<MenuList>([]);
  const isMobile = device === 'MOBILE';
  const dispatch = useDispatch();

  const toggle = () => {
    dispatch(
      setUserItem({
        collapsed: !collapsed,
      })
    );
  };

  const validateSelectedKey = useCallback(() => {
    const findMatchingKey = (menuItems: MenuList): string | undefined => {
      for (const menu of menuItems) {
        if (!menu) continue;

        if (menu.key === location.pathname) {
          return menu.key;
        }

        if ('children' in menu && menu.children) {
          const childKey = findMatchingKey(menu.children);
          if (childKey) return childKey;
        }
      }
      return undefined;
    };

    const matchingKey = findMatchingKey(menuList);
    if (matchingKey) {
      setSelectedKey(matchingKey);
    } else {
      setSelectedKey('');
    }
  }, [menuList, location.pathname]);

  useEffect(() => {
    window.onresize = () => {
      const { device } = getGlobalState();
      const rect = document.body.getBoundingClientRect();
      const needCollapse = rect.width < WIDTH;

      dispatch(
        setUserItem({
          device,
          collapsed: needCollapse,
        })
      );
    };
  }, [dispatch]);

  // useEffect(() => {
  //   const code = getFirstPathCode(location.pathname);
  //   setSelectedKey(location.pathname);
  //   setOpenkey(code);
  // }, [location.pathname]);

  const fetchMenuList = useCallback(async () => {
    setMenuList(mockMenuList);
    // }
  }, [dispatch]);

  useEffect(() => {
    fetchMenuList();
  }, [fetchMenuList]);

  useEffect(() => {
    validateSelectedKey();
  }, [location.pathname, validateSelectedKey]);

  return (
    <>
      {!isMobile ? (
        <Sider
          className="layout-page-sider"
          trigger={null}
          width={200}
          collapsible
          collapsedWidth={isMobile ? 0 : 79}
          collapsed={collapsed}
          breakpoint="md"
          theme="light">
          <div className="logo">
            {collapsed ? (
              <Link to={'/'}>
                <img
                  src={Union2}
                  alt=""
                  style={{
                    marginRight: collapsed ? '2px' : '20px',
                    display: 'block',
                  }}
                />
              </Link>
            ) : (
              <Link to={'/'}>
                <img src={Union} alt="" />
              </Link>
            )}
          </div>
          <MenuComponent
            menuList={menuList}
            openKey={openKey}
            onChangeOpenKey={(k?: string) => setOpenkey(k)}
            selectedKey={selectedKey}
            onChangeSelectedKey={(k: string) => setSelectedKey(k)}
          />
        </Sider>
      ) : (
        <Sider trigger={null} width={200} collapsible>
          <MenuComponent
            menuList={menuList}
            openKey={openKey}
            onChangeOpenKey={(k?: string) => setOpenkey(k)}
            selectedKey={selectedKey}
            onChangeSelectedKey={(k: string) => setSelectedKey(k)}
          />
        </Sider>
      )}
    </>
  );
};

export default SideBar;
