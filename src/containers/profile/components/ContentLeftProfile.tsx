import { ReactComponent as ProfileSvg } from '@/assets/icons/ic_user.svg';
import { NavLink, useLocation } from 'react-router-dom';
export default function ContentLeftProfile() {
  const data = [
    {
      title: 'Tổng quan',
      Icon: ProfileSvg,
    },
    {
      title: 'Hồ sơ của tôi',
      Icon: ProfileSvg,
      to: '/profile',
    },
    {
      title: 'Việc làm của tôi',
      Icon: ProfileSvg,
      to: '/apply-jobs',
    },
    {
      title: 'Lời mời công việc',
      Icon: ProfileSvg,
      to: '/invite-jobs',
    },
  ];

  const location = useLocation();

  return (
    <div className="w-[300px] min-h-[600px] bg-white px-2 sticky top-[20px]">
      <h1 className="pt-4 px-6">Xin chào</h1>
      <h1 className="px-6 text-[22px] font-medium text-[#414042]">
        Võ Mạnh Cường
      </h1>
      {data.map((item: any, index: number) => {
        const isActive = item.to === location.pathname;
        return (
          <NavLink to={item?.to}>
            <div
              className={`flex gap-[16px] py-4 px-6 items-center rounded-xl cursor-pointer
        text-[#414042]
        ${
          isActive
            ? 'bg-[#fff5f5] text-red-500'
            : 'hover:bg-[#fff5f5] hover:text-red-500'
        }
      `}
              key={index}>
              <item.Icon className="" />
              <h1 className="text-[16px] font-medium">{item.title}</h1>
            </div>
          </NavLink>
        );
      })}
    </div>
  );
}
