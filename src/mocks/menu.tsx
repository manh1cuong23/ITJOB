import React from 'react';
import { useLocation } from 'react-router-dom';
import { MenuList } from '@/interface/layout/menu.interface';
import { ReactComponent as DashboardSvg } from '@/assets/menu/ic_dashboard.svg';
import { ReactComponent as MenuTickSvg } from '@/assets/menu/ic_menu_tick.svg';

interface MenuItemWithTickProps {
  label: string;
  path: string;
}

const MenuItemWithTick: React.FC<MenuItemWithTickProps> = ({ label, path }) => {
  const location = useLocation();
  const isSelected = location.pathname === path;

  return (
    <span style={{ paddingLeft: 18 }} className="menu-item-with-tick">
      {label}
      {isSelected && (
        <MenuTickSvg
          className="tick-icon"
          style={{
            marginLeft: '10px',
          }}
        />
      )}
    </span>
  );
};

export const mockMenuList: MenuList = [
  {
    key: '/dashboard',
    label: 'Tổng quan',
    icon: <DashboardSvg />,
  },
  {
    key: '/recruiter/management/job',
    label: 'Quản lý tin tuyển dụng',
    icon: <DashboardSvg />,
  },
  {
    key: '/recruiter/candicate',
    label: 'Tìm kiếm ứng viên',
    icon: <DashboardSvg />,
  },
];
