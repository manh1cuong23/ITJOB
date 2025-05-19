import { DownOutlined, RightOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const menuItems: any = [
  {
    title: 'Tìm kiếm việc làm',
    to: '/list-job',
  },
  { title: 'Việc làm của bạn', to: '/apply-jobs' },
  { title: 'Việc làm được mời', to: '/invite-jobs' },
  { title: 'Blogs', to: '/blog' },
];

export default function HeaderMenu() {
  const [openMenu, setOpenMenu] = useState<any>(null);
  const [openSubMenu, setOpenSubMenu] = useState<any>(null);

  return (
    <div className="relative text-black flex space-x-6">
      {menuItems.map((item: any, index: number) => (
        <div
          key={index}
          className="relative group cursor-pointer"
          onMouseEnter={() => setOpenMenu(index)}
          onMouseLeave={() => {
            setOpenMenu(null);
            setOpenSubMenu(null);
          }}>
          <div
            className={`h-[60px] text-[16px] flex items-center gap-2 pr-4 py-2 ${
              openMenu === index && 'text-primary'
            }`}>
            <NavLink
              to={item?.to}
              className={({ isActive }) =>
                `text-[16px] font-bold ${
                  isActive
                    ? 'text-primary no-underline'
                    : 'text-black no-underline'
                }`
              }>
              {item.title}
            </NavLink>
            {/* {item?.subItems && <DownOutlined />} */}
          </div>
          {openMenu === index && item.subItems && (
            <div className="absolute top-full left-0 w-80 border bg-white shadow-lg">
              {item?.subItems.map((col: any, colIndex: any) => (
                <div
                  key={colIndex}
                  className="relative"
                  onMouseEnter={() => setOpenSubMenu(colIndex)}
                  onMouseLeave={() => setOpenSubMenu(null)}>
                  <a
                    href="#"
                    className="block text-[16px] px-4 py-4 hover:bg-gray-300 flex items-center justify-between">
                    <span className="text-[16px]">{col.title}</span>
                    {col.subItems && <RightOutlined />}
                  </a>
                  {openSubMenu === colIndex && col.subItems && (
                    <div className="absolute top-0 left-full w-64 border bg-white shadow-lg">
                      {col.subItems.map((subItem: any, subIndex: any) => (
                        <a
                          key={subIndex}
                          href="#"
                          className="block text-[16px] px-4 py-4 hover:bg-gray-300 ">
                          {subItem.title}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="text-[16px] text-right text-sm text-gray-400 hover:text-black cursor-pointer px-4 py-2">
                Xem tất cả &gt;
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
