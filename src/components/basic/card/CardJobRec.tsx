import React, { ReactNode } from 'react';
import './style.less';
import { NavLink } from 'react-router-dom';
import MyTag from '../tags/tag';
import { DollarOutlined } from '@ant-design/icons';
import { formatDateNew } from '@/utils/formatDate';
import { getLableSingle } from '@/utils/helper';
import { experienceLevels, levels } from '@/constants/job';
interface MyCardProps {
  title?: string | ReactNode;
  className?: string;
  style?: React.CSSProperties;
  data: any;
}

const CardJobRec: React.FC<MyCardProps> = ({
  title,
  children,
  className = '',
  style,
  data,
}) => {
  console.log('check data', data);
  return (
    <div
      className={` text-black ${className} border rounded-lg pb-[24px]  hover:bg-[#f9ebdd] transition-colors cursor-pointer duration-200 py-4 px-2 bg-[#fff4e9]`}>
      <h1 className="text-[14px] text-[#a6a6a6]">
        Đăng {formatDateNew(data?.createdAt)}
      </h1>
      <h1 className="text-[18px] font-bold my-2">{data?.name}</h1>
      <div className="flex items-center gap-[6px] my-2 pb-2">
        <img
          className="w-[50px] h-[50px] object-contain"
          src="https://itviec.com/rails/active_storage/representations/proxy/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBMGdvREE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--49f107dff1850ed1ff3ede3c7e0a1b99659f1d83/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCem9MWm05eWJXRjBPZ2wzWldKd09oSnlaWE5wZW1WZmRHOWZabWwwV3dkcGFXbHAiLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--20b0435834affc851fb8b496383cefc8135158a8/elca-logo.jpg"
        />
        <h1 className="text-[14px] ">{data?.employer_info?.name}</h1>
      </div>
      <div className="flex items-center gap-[12px] my-2">
        <DollarOutlined />
        <h1 className="text-[14px]">Lên tới {data?.salary[1]}</h1>
      </div>
      <div className="flex items-center gap-[12px] my-2">
        <DollarOutlined />
        <h1 className="text-[14px]">
          {getLableSingle(data?.year_experience, experienceLevels)} (Kinh
          nghiệm)
        </h1>
      </div>
      <div className="flex items-center gap-[12px] my-2">
        <DollarOutlined />
        <h1 className="text-[14px]">{getLableSingle(data?.level, levels)}</h1>
      </div>

      <div className="mt-4">
        {data?.skills_info?.length > 0 &&
          data?.skills_info?.map((item: any, index: number) => (
            <MyTag title={item?.name} className="mx-2" />
          ))}
      </div>
    </div>
  );
};

export default CardJobRec;
