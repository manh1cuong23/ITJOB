import { formatDateNew } from '@/utils/formatDate';
import { Progress, Rate } from 'antd';

interface Props {
  rate: number;
  title: string;
  content: string;
  created: any;
  isInAdmin?: boolean;
}
const title = 'Môi trường tốt, rất phù hợp cho Fresher để học hỏi';
export default function EnvalutionContent({
  rate,
  title,
  content,
  created,
  isInAdmin,
}: Props) {
  return (
    <div className={`bg-white  ${!isInAdmin && 'py-[20px]'}`}>
      <div className={`mx-[20px] ${!isInAdmin && 'pt-6 border-t '}`}>
        <p className="text-[#ccc]">{formatDateNew(created)}</p>
        <h1 className="text-[16px] font-bold">{title}</h1>
        <div className="flex gap-4 items-center my-1">
          <div className="text-[16px] rate-content">
            <Rate allowHalf defaultValue={rate} />
          </div>
          <h1 className="text-blue-500 text-[16px]">Khuyến khích</h1>
        </div>
        <div className="my-2">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </div>
    </div>
  );
}
