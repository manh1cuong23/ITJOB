import { DownOutlined, EditOutlined, RightOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { ReactComponent as DolasSvg } from '@/assets/icons/ic_dollar.svg';
import { MyButton } from '@/components/basic/button';
import { formatDateNew } from '@/utils/formatDate';
import ConfirmModal from '@/components/business/modal/ConfirmModal/BookInterviewModal';
import { acceptInviteCV } from '@/api/features/candicate';
import { message } from 'antd';
import { ApplyStatus } from '@/constants/job';
interface Props {
  data: any;
  setForceUpdate: any;
}
export default function CardJobApply({ data, setForceUpdate }: Props) {
  const [openCancel, setOpenCancel] = useState(false);
  const handleCancel = () => {};
  const handleOk = async () => {
    const res = await acceptInviteCV(data?._id);
    if (res.message) {
      message.success('Chấp nhận lời mời công việc thành công!');
      setForceUpdate((a: number) => a + 1);
    }
  };
  return (
    <div className="bg-white px-4 py-6 flex justify-between mt-[10px]">
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
          <h1 className="text-[15px] text-[#a6a6a6]">Hà Nội</h1>
          <div className="text-[16px] font-bold mt-1 text-[#0ab305] flex gap-[16px] items-center">
            <DolasSvg className="text-[#0ab305]" />
            <h1>
              {data?.job_info?.salary[0] + ' - ' + data?.job_info?.salary[1]}
            </h1>
          </div>
        </div>
      </div>
      <div>
        <h1 className="text-[14px] text-black">
          Lời mời vào ngày {formatDateNew(data?.createdAt)}
        </h1>
        {data?.status == ApplyStatus.WaitingCandidateAcceptInvite && (
          <div className="mt-2 flex items-center gap-[12px]">
            <MyButton onClick={handleOk}>Xác nhận</MyButton>
            <MyButton
              buttonType="secondary"
              onClick={() => {
                setOpenCancel(true);
              }}>
              Từ chối
            </MyButton>
          </div>
        )}
        {data?.status == ApplyStatus.CandidateAcceptInvite && (
          <div className="mt-2">
            <MyButton>Đã chấp nhận lời mời</MyButton>
          </div>
        )}
        {data?.status == ApplyStatus.CandidateRejectInvite && (
          <div className="mt-2">
            <MyButton>Đã từ chối lời mời</MyButton>
          </div>
        )}
      </div>
      <ConfirmModal
        title={`Xác nhận từ chối lời mời`}
        open={openCancel}
        onFinish={handleCancel}
        setOpen={setOpenCancel}
        onCancel={() => {
          setOpenCancel(false);
        }}>
        <h1>Bạn xác nhận bỏ qua lời mời này</h1>
      </ConfirmModal>
    </div>
  );
}
