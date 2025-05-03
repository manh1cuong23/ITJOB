import React, { ReactNode } from 'react';
import './style.less';
import { NavLink } from 'react-router-dom';
import MyTag from '../tags/tag';
import { DollarOutlined } from '@ant-design/icons';
import { formatDateNew } from '@/utils/formatDate';
import { formatCurrency, getLableSingle } from '@/utils/helper';
import { experienceLevels, levels } from '@/constants/job';
import { ReactComponent as ChildSvg } from '@/assets/icons/mdi--user-outline.svg';
import { ReactComponent as DateSvg } from '@/assets/icons/uil--calender.svg';
import { ReactComponent as UserSvg } from '@/assets/icons/ic_profile_update.svg';
import { ReactComponent as BagSvg } from '@/assets/icons/material-symbols--experiment-outline.svg';
import { ReactComponent as EducatiponSvg } from '@/assets/icons/mdi--education-outline.svg';
import { ReactComponent as PlaceSvg } from '@/assets/icons/ic--outline-place.svg';
import { ReactComponent as GenderSvg } from '@/assets/icons/mdi-light--gender-male.svg';
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
      className={` text-black ${className} border rounded-lg pb-[24px]  hover:bg-[#f9ebdd] transition-colors cursor-pointer duration-200 py-4 px-2 bg-red-50 shadow-md`}>
      <h1 className="text-[14px] text-[#a6a6a6]">
        Đăng {formatDateNew(data?.createdAt)}
      </h1>
      <h1 className="text-[18px] font-bold my-2">{data?.name}</h1>
      <div className="flex items-center gap-[6px] my-2 pb-2">
        <img
          className="w-[50px] h-[50px] object-contain"
          src={
            data?.employer_info?.avatar ||
            'https://img.freepik.com/free-vector/contact-icon-3d-vector-illustration-blue-button-with-user-profile-symbol-networking-sites-apps-cartoon-style-isolated-white-background-online-communication-digital-marketing-concept_778687-1715.jpg'
          }
        />
        <h1 className="text-[14px] ">{data?.employer_info?.name}</h1>
      </div>
      <div className="flex items-center gap-[12px] my-2">
        <DollarOutlined />
        <h1 className="text-[14px]">
          Lên tới {formatCurrency(data?.salary[1])}
        </h1>
      </div>
      <div className="flex items-center gap-[12px] my-2">
        <BagSvg />
        <h1 className="text-[14px]">
          {getLableSingle(data?.year_experience, experienceLevels)} (Kinh
          nghiệm)
        </h1>
      </div>
      <div className="flex items-center gap-[12px] my-2">
        <EducatiponSvg />
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
