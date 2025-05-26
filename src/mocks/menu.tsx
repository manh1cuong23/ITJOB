import React from 'react';
import { useLocation } from 'react-router-dom';
import { MenuList } from '@/interface/layout/menu.interface';
import { ReactComponent as DashboardSvg } from '@/assets/menu/ic_dashboard.svg';
import { ReactComponent as TransactionSvg } from '@/assets/menu/transaction.svg';
import { ReactComponent as TestSvg } from '@/assets/menu/documentation.svg';
import { ReactComponent as Test2Svg } from '@/assets/menu/ic_dailyreport.svg';
import { ReactComponent as Test22Svg } from '@/assets/menu/ic_master_data.svg';
import { ReactComponent as Test3Svg } from '@/assets/menu/ic_cloud-lightning.svg';
import { ReactComponent as UserSvg } from '@/assets/menu/ic_user.svg';
import { ReactComponent as EnvalueSvg } from '@/assets/menu/ic_booking.svg';
import { ReactComponent as MenuTickSvg } from '@/assets/menu/ic_menu_tick.svg';
import { HomeOutlined } from '@ant-design/icons';

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
  // {
  //   key: '/dashboard',
  //   label: 'Tổng quan',
  //   icon: <DashboardSvg />,
  // },
  {
    key: '/recruiter/management/job',
    label: 'Quản lý tin tuyển dụng',
    icon: <DashboardSvg />,
  },
  {
    key: '/recruiter/candicate',
    label: 'Tìm kiếm ứng viên',
    icon: <TestSvg />,
  },
  {
    key: '/recruiter/management/transaction',
    label: 'Quản lý giao dịch',
    icon: <TransactionSvg />,
  },
  {
    key: '/recruiter/profile',
    label: 'Xem và chỉnh sửa trang công ty',
    icon: <Test2Svg />,
  },
];
export const adminMenuList: MenuList = [
  {
    key: '/admin/dashboard',
    label: 'Trang chủ',
    icon: <HomeOutlined />,
  },
  {
    key: '/admin/users',
    label: 'Quản lý tài khoản',
    icon: <UserSvg />,
  },
  {
    key: '/admin/jobs',
    label: 'Quản lý tin tuyển dụng',
    icon: <DashboardSvg />,
  },
  {
    key: '/admin/management/package',
    label: 'Quản lý gói tuyển dụng',
    icon: <Test3Svg />,
  },
  {
    key: '/admin/envalutions',
    label: 'Quản lý đánh giá',
    icon: <EnvalueSvg />,
  },
  {
    key: '/admin/management/transaction',
    label: 'Quản lý giao dịch',
    icon: <TransactionSvg />,
  },
  {
    key: '/admin/management/blog',
    label: 'Quản lý blog',
    icon: <Test22Svg />,
  },
];
