import { formatDateNew } from '@/utils/formatDate';
import { Progress, Rate } from 'antd';

interface Props {
  rate: number;
  title: string;
  content: string;
  created: any;
  isInAdmin?: boolean;
  isKK?: boolean;
}
const title = 'Môi trường tốt, rất phù hợp cho Fresher để học hỏi';
export default function EnvalutionContent({
  rate,
  title,
  content,
  created,
  isInAdmin,
  isKK,
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
          {isKK ? (
            <h1 className="text-blue-500 text-[16px]">Khuyến khích</h1>
          ) : (
            <h1 className="text-red-500 text-[16px]">Không khuyến khích</h1>
          )}
        </div>
        <div className="my-2">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </div>
    </div>
  );
}
