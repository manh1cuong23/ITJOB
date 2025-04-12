import InforJob from '@/containers/job-detail/components/InforJob';
import React, { useEffect, useState } from 'react';
import { MyButton } from '../button';
import { NavLink } from 'react-router-dom';

const CardReduceCompany: React.FC = () => {
  return (
    <div className="border shadow-sm p-4 bg-white hover:shadow-md hover:cursor-pointer rounded-md">
      <div>
        <div className="flex gap-[16px] items-center">
          <img
            className="w-[50px] h-[50px] object-cover"
            src="https://salt.topdev.vn/Ino2MeJAunov7Yvy_iMPCsjMsSmP51sFxzFzfrFusPI/fit/384/1000/ce/1/aHR0cHM6Ly9hc3NldHMudG9wZGV2LnZuL2ltYWdlcy8yMDIzLzA5LzEyL1RvcERldi1RcG1ZTWFYTmJEMGlXU29kLTE2OTQ1MzM1NTQucG5n"
          />
          <h1 className="text-[22px] font-medium">Tên công ty</h1>
        </div>

        <div>
          <InforJob title="Quy mô" description="6-20 nhân viên" />
          <InforJob title="Liên hệ" description="Võ Mạnh Cường" />
          <InforJob title="Địa chỉ" description="Nguyên xã" />
          <InforJob />
        </div>
        <h1 className="text-[16px] font-medium my-4">Chia sẻ công ty</h1>
        <div className="flex justify-center my-4">
          <NavLink to="/recruiter/123">
            <MyButton className="!w-[280px]">Xem trang công ty</MyButton>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default CardReduceCompany;
