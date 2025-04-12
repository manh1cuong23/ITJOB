import { useState } from 'react';
import ContentLeftProfile from '../profile/components/ContentLeftProfile';
import CardJobApply from './components/CardJobApply';

export default function JobInviteContainer() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-[20px] mx-auto w-[1260px] flex gap-[20px]">
      <ContentLeftProfile />
      <div className="  w-full">
        <div className="bg-white p-4">
          <h1 className="text-[22px] font-bold text-[#333] mb-1  w-full">
            Lời mời công việc
          </h1>
          <h1 className="text-[18px] font-medium mb-4">
            ITviec cung cấp dịch vụ kết nối ứng viên ẩn danh với các cơ hội việc
            làm phù hợp.
          </h1>
          <div className="flex gap-[16px] itens-center">
            <div className="cursor-pointer">
              <h1 className="text-[18px] text-primary font-bold  py-2 border-b border-red-500">
                Đang chờ
              </h1>
            </div>
            <div className="cursor-pointer">
              <h1 className="text-[18px] text-[#626262] font-bold  py-2 ">
                Đã chấp nhận
              </h1>
            </div>
            <div className="cursor-pointer">
              <h1 className="text-[18px] text-[#626262] font-bold  py-2 ">
                Hết hạn
              </h1>
            </div>
          </div>
        </div>
        <CardJobApply />
        <CardJobApply />
        <CardJobApply />
        <CardJobApply />
        <CardJobApply />
      </div>
    </div>
  );
}
