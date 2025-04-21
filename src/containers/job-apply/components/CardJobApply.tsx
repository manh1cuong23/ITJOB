import { DownOutlined, EditOutlined, RightOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { ReactComponent as DolasSvg } from '@/assets/icons/ic_dollar.svg';
import { formatDateNew } from '@/utils/formatDate';
import { MyButton } from '@/components/basic/button';
import { Button } from 'antd';
import BookInterviewModal from '@/components/business/modal/book-interview/BookInterviewModal';
import { ApplyStatus } from '@/constants/job';
import { NavLink } from 'react-router-dom';
interface Props {
  data: any;
}

export default function CardJobApply({ data }: Props) {
  const [open, setOpen] = useState(false);
  const [openSeeMe, setOpenSeeme] = useState(false);
  const [openInfor, setOpenInfor] = useState(false);
  console.log(
    'check ddata2',
    data?.status == ApplyStatus.Interview ||
      data?.status == ApplyStatus.Passed ||
      data?.status == ApplyStatus.Failed
  );

  console.log('check ddata', data);
  const getStatusText = () => {
    switch (data?.status) {
      case ApplyStatus.Interview:
        return 'Chờ nhà tuyển dụng đánh giá';
      case ApplyStatus.Passed:
        return 'Đậu phỏng vấn';
      case ApplyStatus.Failed:
        return 'Không đạt yêu cầu';
      default:
        return 'Xác nhận phỏng vấn';
    }
  };

  const getButtonClass = () => {
    switch (data?.status) {
      case ApplyStatus.Passed:
        return 'bg-green-500 text-white hover:bg-green-600';
      case ApplyStatus.Failed:
        return 'bg-red-500 text-white hover:bg-red-600';
      case ApplyStatus.Interview:
        return ''; // không style khi disabled
      default:
        return 'bg-primary text-white hover:bg-primary/90';
    }
  };

  return (
    <div className="bg-white px-4 py-6 flex justify-between mt-[10px]">
      <NavLink to={`/${data?.job_id}/job-detail`}>
        <div className="flex items-center gap-[16px]">
          <img
            className="w-[80px] h-[80px] object-cover rounded-base"
            src="https://itviec.com/rails/active_storage/representations/proxy/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBMzhxREE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--96410be9fc35379f21c6201ae00c2d6c44be6feb/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCem9MWm05eWJXRjBPZ2wzWldKd09oSnlaWE5wZW1WZmRHOWZabWwwV3dkcGFXbHAiLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--20b0435834affc851fb8b496383cefc8135158a8/goline-corporation-logo.jpg"
          />
          <div>
            <h1 className="text-[17px] font-bold text-[#626262]">
              {data?.job_info?.name}
            </h1>
            <h1 className="text-[15px] font-medium mt-2">
              {data?.job_info?.employer_info?.name}
            </h1>
            <h1 className="text-[15px] text-[#a6a6a6]">
              {data?.job_info?.city}
            </h1>
            <div className="text-[16px] font-bold mt-1 text-[#0ab305] flex gap-[16px] items-center">
              <DolasSvg className="text-[#0ab305]" />
              <h1>
                {data?.job_info?.salary[0] + ' - ' + data?.job_info?.salary[1]}
              </h1>
            </div>
          </div>
        </div>
      </NavLink>
      <div>
        <h1 className="text-[14px] text-black">
          Ứng tuyển vào ngày {formatDateNew(data?.job_info?.createdAt)}
        </h1>
        {data?.status == ApplyStatus.WaitingCandidateAcceptSchedule ||
        data?.status == ApplyStatus?.WaitingEmployerAcceptSchedule ? (
          <div>
            <div className="flex justify-between gap-[16px] mt-3 items-center">
              <div
                className="text-primary hover:underline cursor-pointer"
                onClick={e => {
                  e.preventDefault(); // Ngăn hành vi mặc định như điều hướng
                  e.stopPropagation(); // Ngăn
                  setOpen(true);
                }}>
                Lịch phỏng vấn từ nhà tuyển dụng
              </div>
              <Button disabled>Chưa xác nhận</Button>
            </div>
            <div className="flex justify-between gap-[16px] mt-3 items-center">
              <div
                className="text-blue-500 hover:underline cursor-pointer"
                onClick={() => {
                  setOpenSeeme(true);
                }}>
                Lịch phỏng vấn đề xuất của bạn
              </div>
              <Button disabled>Chưa xác nhận</Button>
            </div>
          </div>
        ) : (
          ''
        )}
        {data?.status == ApplyStatus.Interview ||
        data?.status == ApplyStatus.Passed ||
        data?.status == ApplyStatus.Failed ? (
          <div className="flex justify-between gap-[16px] mt-3 items-center">
            <div
              className="text-blue-500 hover:underline cursor-pointer"
              onClick={() => {
                setOpenInfor(true);
              }}>
              Thông tin thời gian họp
            </div>
            <Button
              disabled={data?.status === ApplyStatus.Interview}
              className={getButtonClass()}>
              {getStatusText()}
            </Button>
          </div>
        ) : (
          ''
        )}
      </div>
      <BookInterviewModal
        id={data?._id}
        isCandicate
        isSeeEmploy
        open={open}
        title={'Thông tin phỏng vấn từ nhà tuyển dụng'}
        isViewMode={
          data?.status == ApplyStatus.WaitingCandidateAcceptSchedule ||
          data?.status == ApplyStatus.WaitingEmployerAcceptSchedule
        }
        onCancel={() => {
          setOpen(false);
        }}
      />
      <BookInterviewModal
        id={data?._id}
        isCandicate
        isEmployChange
        open={openSeeMe}
        title={'Thông tin phỏng vấn bạn đã đề xuất'}
        isViewMode={
          data?.status == ApplyStatus.WaitingCandidateAcceptSchedule ||
          data?.status == ApplyStatus.WaitingEmployerAcceptSchedule
        }
        onCancel={() => {
          setOpenSeeme(false);
        }}
      />
      <BookInterviewModal
        id={data?._id}
        isCandicate
        isEmployChange
        open={openInfor}
        title={'Thông tin thời gian phỏng vấn'}
        isViewMode={true}
        onCancel={() => {
          setOpenInfor(false);
        }}
      />
    </div>
  );
}
