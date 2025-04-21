import { Progress } from 'antd';

interface ProgressCircleProps {
  percent: number;
  description: string;
}

export default function ProgressCircle({
  percent,
  description,
}: ProgressCircleProps) {
  return (
    <div className="flex items-center gap-[16px]">
      {/* Vòng tròn tiến trình */}
      <Progress
        type="circle"
        percent={percent}
        width={120} // Kích thước vòng tròn (đường kính)
        strokeWidth={8} // Độ dày của vòng tròn
        strokeColor="#52c41a" // Màu xanh lá giống trong hình
        trailColor="#e8e8e8" // Màu nền của vòng tròn
        format={percent => `${percent}%`} // Hiển thị phần trăm ở giữa
        className="custom-progress"
      />

      {/* Mô tả bên cạnh */}
      <div className="text-[14px] text-black font-medium">{description}</div>
    </div>
  );
}
