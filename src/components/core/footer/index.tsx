import { FC } from 'react';

const data = {
  about: [
    'Về chúng tôi',
    'Liên hệ',
    'Thỏa thuận sử dụng',
    'Cơ hội việc làm',
    'Quy định bảo mật',
    'Quy chế hoạt động của sàn giao dịch thương mại điện tử TopDev',
    'Giải quyết khiếu nại',
  ],
  featureLinks: [
    'Tính lương Gross - Net',
    'Tạo CV',
    'Tìm kiếm công việc IT',
    'Trắc nghiệm tính cách',
  ],
  employerLinks: [
    'Đăng việc làm IT',
    'Tìm kiếm nhân tài',
    'Báo cáo thị trường IT',
    'Tạo tài khoản',
  ],
};

const Footer: FC<{}> = () => {
  return (
    <div className="layout-foot bg-gray-200 mt-[20px]">
      <div className="pt-[40px]  mx-[100px]">
        <div className="grid grid-cols-6 gap-x-2">
          <div className="col-span-2">
            <div className="my-4">
              <img
                src="https://c.topdevvn.com/v4/assets/images/td-logo.png"
                className=""
              />
            </div>
            <div className="text-[#424242] text-[16px] my-3">
              Tầng 12A, Toà nhà AP Tower, 518B Điện Biên Phủ, Phường 21, Quận
              Bình Thạnh, Thành phố Hồ Chí Minh
            </div>
            <div className="text-[#424242] text-[16px] my-3">
              Liên hệ : 0888 1555 00 - contact@topdev.vn
            </div>
          </div>
          <div className="col-span-1">
            <h1 className="text-[16px] font-medium text-[#292929] my-4">
              Về JobHub
            </h1>
            {data?.featureLinks?.map((item: any) => (
              <p className="text-[#424242] text-[16px] my-3">{item}</p>
            ))}
          </div>
          <div className="col-span-1">
            <h1 className="text-[16px] font-medium text-[#292929] my-4">
              Ứng viên
            </h1>
            {data?.about?.map((item: any) => (
              <p className="text-[#424242] text-[16px] my-3">{item}</p>
            ))}
          </div>
          <div className="col-span-1">
            <h1 className="text-[16px] font-medium text-[#292929] my-4">
              Nhà tuyển dụng
            </h1>
            {data?.employerLinks?.map((item: any) => (
              <p className="text-[#424242] text-[16px] my-3">{item}</p>
            ))}
          </div>
          <div className="col-span-1"></div>
        </div>
      </div>
      <div className="py-[20px] mx-[20px] border">
        <div className="text-center">
          Copyright © IT VIEC JSC MST: 0312192258
        </div>
      </div>
    </div>
  );
};

export default Footer;
