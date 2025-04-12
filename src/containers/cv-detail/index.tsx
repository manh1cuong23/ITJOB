import { MyButton } from '@/components/basic/button';
import BookInterviewModal from '@/components/business/modal/book-interview/BookInterviewModal';
import React, { useEffect, useState } from 'react';

const dataUser = [
  {
    name: 'Ứng viên',
    value: 'Ngô thị Đậu',
  },
  {
    name: 'Ngày sinh',
    value: '01/09/1999',
  },
  {
    name: 'Quê quán',
    value: 'Nam Đàn, Nghệ An',
  },
  {
    name: 'Giới tính',
    value: 'Nam',
  },
];
const dataUser2 = [
  {
    name: 'Năm kinh nghiệm',
    value: '6 tháng',
  },
  {
    name: 'Học Vấn',
    value: 'Đại học',
  },
  {
    name: 'Cấp bậc',
    value: 'Intern',
  },
  {
    name: 'Ngành nghề',
    value: 'IT',
  },
];
const dataUser3 = [
  {
    name: 'Chức vụ hiện tại',
    value: 'Senior công ty A',
  },
  {
    name: 'Mức lương mong muống',
    value: '20 - 30 triệu',
  },
  {
    name: 'Trình độ ngoại ngữ',
    value: 'Cơ bản giao tiếp',
  },
];
const CVDetailContainer: React.FC = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="mx-auto w-[1260px] pt-[20px] bg-white h-[500px] mt-[20px] px-4">
      <div>
        <div className="flex gap-[16px] items-center mb-4">
          <h1 className="text-[22px] font-medium ">Chức danh/ Vị trí</h1>
          <h1>: Senior Content creater</h1>
        </div>
        <div className="flex items-center ml-5">
          <img
            className="w-[120px] h-[160px] bg-gray-500 object-cover mr-4"
            src="https://png.pngtree.com/png-clipart/20231020/original/pngtree-job-candidate-post-employee-png-png-image_13372804.png"
          />
          <div className="w-full">
            {dataUser &&
              dataUser.length > 0 &&
              dataUser.map((item, index) => (
                <div className="flex items-center gap-[16px] my-2">
                  <div className=" text-[14px] font-bold w-[100px]">
                    <h1>{item.name} :</h1>
                  </div>
                  <div className="">
                    <h1>{item.value}</h1>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <h1 className="text-[22px] font-medium my-4">Thông tin nghề nghiệp</h1>

        <div className="w-full ml-5 flex  gap-[40px]">
          <div>
            {dataUser2 &&
              dataUser2.length > 0 &&
              dataUser2.map((item, index) => (
                <div className="flex items-center gap-[16px] my-2">
                  <div className=" text-[14px] font-bold w-[150px]">
                    <h1>{item.name} :</h1>
                  </div>
                  <div className="">
                    <h1>{item.value}</h1>
                  </div>
                </div>
              ))}
          </div>
          <div>
            {dataUser3 &&
              dataUser3.length > 0 &&
              dataUser3.map((item, index) => (
                <div className="flex items-center gap-[16px] my-2">
                  <div className=" text-[14px] font-bold min-w-[200px]">
                    <h1>{item.name} :</h1>
                  </div>
                  <div className="">
                    <h1>{item.value}</h1>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <h1 className="text-[22px] font-medium my-4 h-[200px]">
          Nội dung Hồ Sơ
        </h1>
      </div>
      <div className="py-4 flex justify-end gap-[16px]">
        <MyButton buttonType="secondary">Bỏ qua</MyButton>
        <MyButton
          onClick={() => {
            setOpen(true);
          }}>
          Đã Liên hệ phỏng vấn
        </MyButton>
      </div>
      <BookInterviewModal
        title={`Lưu lịch phỏng vấn`}
        id={'1'}
        open={open}
        setOpen={setOpen}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </div>
  );
};

export default CVDetailContainer;
