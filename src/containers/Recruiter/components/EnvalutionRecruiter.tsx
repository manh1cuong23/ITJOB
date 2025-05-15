import { ReactComponent as ProfileSvg } from '@/assets/icons/ic_user.svg';
import MyTag from '@/components/basic/tags/tag';
import { OtOption } from '@/constants/job';
import { getLableSingle } from '@/utils/helper';
import { FacebookOutlined, StarOutlined } from '@ant-design/icons';
import { Rate } from 'antd';
import { NavLink, useLocation } from 'react-router-dom';
import Star from './Star';
import ProgressCircle from './Progess';
import EnvalutionContent from './EnvalutionContent';

export default function EnvalutionRecruiter({ data }: any) {
  console.log('check datcca2', data?.rateSummary?.encouragedPercentage);

  return (
    <div className="mt-4">
      <div className="bg-white p-[20px]">
        <h1 className="font-bold text-[24px]">Đánh giá chung</h1>
        <div className="py-[20px] flex items-center px-3 border-top justify-between ">
          <div className="flex flex-col items-center w-[200px]">
            <h1 className="font-bold text-[30px]">
              {data?.rateSummary?.averageRate}
            </h1>
            <div className="rate-header">
              <Rate
                allowHalf
                defaultValue={data?.rateSummary?.averageRate}
                className="my-1"
                style={{ fontSize: '30px' }} // Tăng kích thước ngôi sao
              />
            </div>
            <h1 className="text-[16px] font-medium">
              {data?.result?.length} đánh giá
            </h1>
          </div>
          <div className="w-[400px]">
            <Star
              count={data?.rateSummary?.rateCounts?.rate5}
              title={5}
              value={data?.rateSummary?.rateDistribution?.rate5}
            />
            <Star
              count={data?.rateSummary?.rateCounts?.rate4}
              title={4}
              value={data?.rateSummary?.rateDistribution?.rate4}
            />
            <Star
              count={data?.rateSummary?.rateCounts?.rate3}
              title={3}
              value={data?.rateSummary?.rateDistribution?.rate3}
            />
            <Star
              count={data?.rateSummary?.rateCounts?.rate2}
              title={2}
              value={data?.rateSummary?.rateDistribution?.rate2}
            />
            <Star
              count={data?.rateSummary?.rateCounts?.rate1}
              title={1}
              value={data?.rateSummary?.rateDistribution?.rate1}
            />
          </div>
          <div>
            <ProgressCircle
              percent={data?.rateSummary?.encouragedPercentage}
              description="Khuyến khích làm việc tại đây"
            />
          </div>
        </div>
      </div>
      <div className="bg-white p-[20px] mt-[20px]">
        <h1 className="font-bold text-[24px]">
          {data?.result?.length} đánh giá
        </h1>
      </div>
      <div className=" overflow-auto max-h-[400px]">
        {data &&
          data?.result &&
          data?.result?.length > 0 &&
          data?.result?.map((item: any, index: number) => (
            <EnvalutionContent
              title={item?.title}
              isKK={item?.isEncouragedToWorkHere}
              content={item?.content}
              created={item?.createdAt}
              key={index}
              rate={item?.rate}
            />
          ))}
      </div>
    </div>
  );
}
