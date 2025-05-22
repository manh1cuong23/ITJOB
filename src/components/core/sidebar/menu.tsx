import { useState, type FC } from 'react';

import { Menu } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { css } from '@emotion/react';
import { setUserItem } from '@/stores/slices/auth.slice';
import { MenuList } from '@/interface/layout/menu.interface';
import type { MenuProps } from 'antd';
interface IMenuProps {
  menuList: MenuList;
  openKey?: string;
  onChangeOpenKey: (key?: string) => void;
  selectedKey: string;
  onChangeSelectedKey: (key: string) => void;
}
interface LevelKeysProps {
  key?: string;
  children?: LevelKeysProps[];
}

const getLevelKeys = (items1: LevelKeysProps[]) => {
  const key: Record<string, number> = {};
  const func = (items2: LevelKeysProps[], level = 1) => {
    items2.forEach(item => {
      if (item.key) {
        key[item.key] = level;
      }
      if (item.children) {
        func(item.children, level + 1);
      }
    });
  };
  func(items1);
  return key;
};
const MenuComponent: FC<IMenuProps> = props => {
  const { menuList, selectedKey, onChangeSelectedKey } = props;
  const { device, collapsed } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onMenuClick = (path: string) => {
    onChangeSelectedKey(path);
    navigate(path);

    if (device !== 'DESKTOP') {
      dispatch(setUserItem({ collapsed: true }));
    }
  };
  const [stateOpenKeys, setStateOpenKeys] = useState<string[]>([]);
  const levelKeys = getLevelKeys(menuList as LevelKeysProps[]);
  const onOpenChange: MenuProps['onOpenChange'] = openKeys => {
    const currentOpenKey = openKeys.find(
      key => stateOpenKeys.indexOf(key) === -1
    );
    // open
    if (currentOpenKey !== undefined) {
      const repeatIndex = openKeys
        .filter(key => key !== currentOpenKey)
        .findIndex(key => levelKeys[key] === levelKeys[currentOpenKey]);

      setStateOpenKeys(
        openKeys
          .filter((_, index) => index !== repeatIndex)
          .filter(key => levelKeys[key] <= levelKeys[currentOpenKey])
      );
    } else {
      // close
      setStateOpenKeys(openKeys);
    }
  };

  return (
    <Menu
      mode="inline"
      css={style}
      // inlineCollapsed={collapsed}
      selectedKeys={[selectedKey]}
      openKeys={stateOpenKeys}
      onOpenChange={onOpenChange}
      onSelect={k => onMenuClick(k.key)}
      className="layout-page-sider-menu text-2"
      items={menuList}></Menu>
  );
};

export default MenuComponent;

const style = css`
  width: 100%;
  height: calc(100vh - 60px);
  border-right: none !important;
  overflow-y: auto;
  overflow-x: hidden;
  .ant-menu-item,
  .ant-menu-submenu {
    user-select: none; /* Trình duyệt hiện đại */
    -webkit-user-select: none; /* Safari */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
  }

  .ant-menu-item,
  .ant-menu-submenu-title {
    margin: 0 16px 16px !important;
    width: 175px;
  }
  li.ant-menu-item:first-of-type {
    margin-top: 16px !important;
  }
`;
