import React, { useEffect, useState } from 'react';

const DashboardAdminContainer: React.FC = () => {
  return (
    <div className="dashboard bg-white m-[20px] pl-[20px]">
      <h1 className="text-[22px] font-medium mt-[20px]">
        Chào mừng bạn đã quay trở lại
      </h1>
      <div className="flex mt-[40px]">
        <div className="w-1/4  ">
          <div className="m-2 h-[140px] rounded-xl bg-[linear-gradient(135deg,rgba(59,130,246,0.48),rgba(96,165,250,0.48))]">
            <div className="p-2">Số tin tuyển dụng</div>
            <div className="my-auto text-center text-[30px] font-medium mt-2">
              88
            </div>
          </div>
        </div>
        <div className="w-1/4  ">
          <div className="m-2 h-[140px] rounded-xl bg-[linear-gradient(135deg,rgba(236,72,153,0.48),rgba(244,114,182,0.48))]">
            <div className="p-2">Số ứng viên ứng tuyển</div>
            <div className="my-auto text-center text-[30px] font-medium mt-2">
              88
            </div>
          </div>
        </div>
        <div className="w-1/4  ">
          <div className="m-2 h-[140px] rounded-xl bg-[linear-gradient(135deg,rgba(253,224,71,0.48),rgba(250,204,21,0.48))]">
            <div className="p-2">Số ứng viên phỏng vấn đậu</div>
            <div className="my-auto text-center text-[30px] font-medium mt-2">
              88
            </div>
          </div>
        </div>
        <div className="w-1/4  ">
          <div className="m-2 h-[140px] rounded-xl bg-[linear-gradient(135deg,rgba(254,215,170,0.48),rgba(253,186,116,0.48))]">
            <div className="p-2">Số ứng viên trong quá trình phỏng vấn</div>
            <div className="my-auto text-center text-[30px] font-medium mt-2">
              88
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdminContainer;
