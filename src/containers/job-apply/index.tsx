import { useState } from 'react';
import ContentLeftProfile from '../profile/components/ContentLeftProfile';
import CardJobApply from './components/CardJobApply';

export default function JobApplyContainer() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-[20px] mx-auto w-[1260px] flex gap-[20px]">
      <ContentLeftProfile />
      <div className="  w-full">
        <div className="bg-white p-4">
          <h1 className="text-[22px] font-bold text-[#333] mb-4 w-full">
            Việc làm của tôi
          </h1>
          <div className="flex gap-[16px] itens-center">
            <div className="cursor-pointer">
              <h1 className="text-[18px] text-primary font-bold  py-2 border-b border-red-500">
                Đã ứng tuyển
              </h1>
            </div>
            <div className="cursor-pointer">
              <h1 className="text-[18px] text-[#626262] font-bold  py-2 ">
                Đã Lưu
              </h1>
            </div>
            <div className="cursor-pointer">
              <h1 className="text-[18px] text-[#626262] font-bold  py-2 ">
                Đã được liên hệ phỏng vấn
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
