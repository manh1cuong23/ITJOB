import { StarOutlined } from '@ant-design/icons';
import { Rate } from 'antd'; // Giữ import này nếu bạn cần dùng Rate ở nơi khác
import { NavLink, useLocation } from 'react-router-dom';
import { ReactComponent as ProfileSvg } from '@/assets/icons/ic_user.svg';
import MyTag from '@/components/basic/tags/tag';
import { OtOption } from '@/constants/job';
import { getLableSingle } from '@/utils/helper';

export default function Star({ title, value, count }: any) {
  // Hàm xác định màu sắc dựa trên value
  const getProgressColor = (value: number) => {
    if (value < 40) return 'bg-red-500'; // Đỏ cho value thấp
    if (value < 70) return 'bg-yellow-500'; // Vàng cho value trung bình
    return 'bg-green-500'; // Xanh cho value cao
  };

  return (
    <div className="flex gap-[16px] items-center my-2">
      {/* Tiêu đề và ngôi sao */}
      <div className="flex items-center gap-1">
        {title} <StarOutlined className="custom-star" />
      </div>

      {/* Thanh range với tiến trình động */}
      <div className="w-[200px] h-[10px] rounded-lg bg-gray-200 overflow-hidden">
        <div
          className={`h-full rounded-lg bg-yellow-500 transition-all duration-300`}
          style={{ width: `${value}%` }} // Chiều rộng dựa trên value
        ></div>
      </div>

      {/* Giá trị phần trăm */}
      <h1 className="text-[14px] text-black font-medium">
        {value}% ({count})
      </h1>
    </div>
  );
}
