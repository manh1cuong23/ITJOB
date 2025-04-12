import React from 'react';
import { DownOutlined, SmileOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Space } from 'antd';
interface Props {
  icon?: any;
  title: string;
}
const MenuItem: React.FC<Props> = ({ icon, title }) => (
  <div className="px-2 py-4 w-[300px] flex items-center capitalize text-black  sm:text-xs hover:text-[rgb(221,63,36)]   lg:text-base">
    {title}
    {icon && <span className="ml-2">{icon}</span>}
  </div>
);

export default MenuItem;
