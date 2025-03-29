import React from 'react';
import { useLocation } from 'react-router-dom';
import { MenuList } from '@/interface/layout/menu.interface';
import { ReactComponent as DashboardSvg } from '@/assets/menu/ic_dashboard.svg';
import { ReactComponent as InventorySvg } from '@/assets/icons/ic_container.svg';
import { ReactComponent as RateManageSvg } from '@/assets/icons/ic_dollar.svg';
import { ReactComponent as BookingSvg } from '@/assets/menu/ic_booking.svg';
import { ReactComponent as MasterDataSvg } from '@/assets/menu/ic_master_data.svg';
import { ReactComponent as AllotmentSvg } from '@/assets/menu/ic_cloud-lightning.svg';
import { ReactComponent as MenuTickSvg } from '@/assets/menu/ic_menu_tick.svg';
import { ReactComponent as SubMenu } from '@/assets/menu/ic_menu_submenu.svg';

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
    label: 'Dashboard',
    icon: <DashboardSvg />,
  },
  {
    type: 'divider',
  },
  {
    key: '/daily-operation',
    label: 'DAILY OPERATION',
    type: 'group',
    children: [
      {
        key: '/booking',
        label: 'Booking Approval',
        icon: <BookingSvg />,
      },
    ],
  },
  {
    type: 'divider',
  },
  {
    key: '/rates',
    label: 'SETTING',
    type: 'group',
    children: [
      {
        key: '/services',
        label: 'Rate Management',
        icon: <RateManageSvg />,
        children: [
          {
            key: '/service',
            label: <MenuItemWithTick label="Service" path="/service" />,
            icon: <SubMenu className="submenu-icon" />,
          },
          {
            key: '/package-plan',
            label: (
              <MenuItemWithTick label="Package plan" path="/package-plan" />
            ),
            icon: <SubMenu className="submenu-icon" />,
          },
          {
            key: '/rate-code',
            label: <MenuItemWithTick label="Rate Code" path="/rate-code" />,
            icon: <SubMenu className="submenu-icon" />,
          },
          {
            key: '/rate-plan',
            label: <MenuItemWithTick label="Rate Plan" path="/rate-plan" />,
            icon: <SubMenu className="submenu-icon" />,
          },
          {
            key: '/room-rate',
            label: <MenuItemWithTick label="Room Rate" path="/room-rate" />,
            icon: <SubMenu className="submenu-icon" />,
          },
        ],
      },
      {
        key: '/inventorys',
        label: 'Inventory Management',
        icon: <InventorySvg />,
        children: [
          {
            key: '/room-availability',
            label: (
              <MenuItemWithTick
                label="Room Availability"
                path="/room-availability"
              />
            ),
            icon: <SubMenu className="submenu-icon" />,
          },
          {
            key: '/inventory-input',
            label: (
              <MenuItemWithTick
                label="Inventory Input"
                path="/inventory-input"
              />
            ),
            icon: <SubMenu className="submenu-icon" />,
          },
        ],
      },
    ],
  },
  {
    type: 'divider',
  },
  {
    key: '/allotments',
    label: 'Allotment',
    type: 'group',
    children: [
      {
        key: '/allotments',
        label: 'Allotment',
        icon: <AllotmentSvg />,
        children: [
          {
            key: '/allotment',
            label: <MenuItemWithTick label="Allotment" path="/allotment" />,
            icon: <SubMenu className="submenu-icon" />,
          },
          {
            key: '/allotment-report',
            label: <MenuItemWithTick label="Allotment Report" path="/allotment-report" />,
            icon: <SubMenu className="submenu-icon" />,
          },
        ],
      },
    ],
  },
  {
    key: '/settings',
    label: 'SETTING',
    type: 'group',
    children: [
      {
        key: '/system',
        label: 'Master Data',
        icon: <MasterDataSvg />,
        children: [
          {
            key: '/hotel-list',
            label: <MenuItemWithTick label="Hotel" path="/hotel-list" />,
            icon: <SubMenu className="submenu-icon" />,
          },
          {
            key: '/room-type',
            label: <MenuItemWithTick label="Room Type" path="/room-type" />,
            icon: <SubMenu className="submenu-icon" />,
          },
        ],
      },
    ],
  },
];
