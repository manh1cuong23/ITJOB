import InforJob from '@/containers/job-detail/components/InforJob';
import React, { useEffect, useState } from 'react';
import { MyButton } from '../button';
import { NavLink } from 'react-router-dom';
import { ReactComponent as ChildSvg } from '@/assets/icons/mdi--user-outline.svg';
import { ReactComponent as DateSvg } from '@/assets/icons/uil--calender.svg';
import { ReactComponent as UserSvg } from '@/assets/icons/ic_profile_update.svg';
import { ReactComponent as BagSvg } from '@/assets/icons/material-symbols--experiment-outline.svg';
import { ReactComponent as EducatiponSvg } from '@/assets/icons/mdi--education-outline.svg';
import { ReactComponent as PlaceSvg } from '@/assets/icons/ic--outline-place.svg';
import { ReactComponent as GenderSvg } from '@/assets/icons/mdi-light--gender-male.svg';
interface Props {
  data?: any;
}

const CardReduceCompany: React.FC<Props> = ({ data }) => {
  return (
    <div className="border shadow-sm p-4 bg-white hover:shadow-md hover:cursor-pointer rounded-md">
      <div>
        <div className="flex gap-[16px] items-center">
          <img
            className="w-[50px] h-[50px] object-cover"
            src={
              data?.avatar ||
              'https://salt.topdev.vn/75VadizXM8hmNkdG26qUXYwIAVX3KcVcqvehkraKrMQ/fit/828/1000/ce/1/aHR0cHM6Ly9hc3NldHMudG9wZGV2LnZuL2ltYWdlcy8yMDI1LzAyLzIwL1RvcERldi1hN2UyZmMyZmE5Y2IyOGQzZDMyM2Y2ODgyNDIxNDU3OS0xNzQwMDQ0NzQyLnBuZw'
            }
          />
          <h1 className="text-[22px] font-medium">{data?.name}</h1>
        </div>

        <div>
          <InforJob
            title="Quy mô"
            description={data?.employer_size}
            Icon={ChildSvg}
          />
          <InforJob
            title="Thời gian làm việc"
            Icon={DateSvg}
            description={data?.date_working}
          />
          <InforJob
            title="Địa chỉ"
            Icon={PlaceSvg}
            description={data?.address}
          />
        </div>
        <h1 className="text-[16px] font-medium my-4">Chia sẻ công ty</h1>
        <div className="flex justify-center my-4">
          <NavLink to={`/recruiter/${data?._id}`}>
            <MyButton className="!w-[280px]">Xem trang công ty</MyButton>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default CardReduceCompany;
