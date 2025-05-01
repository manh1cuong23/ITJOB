import { DownOutlined, EditOutlined, RightOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { ReactComponent as MailSvg } from '@/assets/icons/basil--gmail-outline.svg';
import { ReactComponent as PlaceSvg } from '@/assets/icons/ic--outline-place.svg';
import { ReactComponent as PhoneSvg } from '@/assets/icons/mdi-light--phone.svg';
import { ReactComponent as CalendearSvg } from '@/assets/icons/ic_calendar.svg';
import { ReactComponent as FeatureSvg } from '@/assets/icons/ic_featured.svg';
import { ReactComponent as ProfileSvg } from '@/assets/icons/ic_user.svg';
import MyTag from '@/components/basic/tags/tag';
import ProfileModal from '@/components/business/modal/profile';
import ContentLeftProfile from './components/ContentLeftProfile';
import { getMe } from '@/api/features/user';
import { getLableSingle } from '@/utils/helper';
import { educationLevels, englishSkillOptions, levels } from '@/constants/job';
import { formatDate } from '@/utils/formatDate';
import { Button } from 'antd';

export default function ProfilePageContainer() {
  const [open, setOpen] = useState(false);
  const [dataMe, setDataMe] = useState<any>([]);

  const fetMe = async () => {
    const resMe = await getMe();
    if (resMe.result) {
      const { candidate_info } = resMe.result;
      candidate_info.email = resMe.result.email;
      setDataMe(candidate_info);
    }
  };

  useEffect(() => {
    fetMe();
  }, []);

  return (
    <div className="mt-[20px] mx-auto w-[1260px] flex gap-[20px]">
      <ContentLeftProfile />
      <div className="w-full">
        <div className="bg-white p-2">
          <h1 className="text-[22px] font-bold text-[#333] mb-4">
            Thông tin chung
          </h1>
          <div className="flex gap-[40px]">
            <img
              className="rounded-full h-[160px] w-[160px] object-cover"
              src="https://c.topdevvn.com/v4/_next/static/media/no-avatar.6db79731.svg"
            />
            <div className="flex w-full justify-between">
              <div className="w-full">
                <h1 className="text-[22px] font-medium">{dataMe?.name}</h1>
                <div className="w-full flex items-center">
                  <h1 className="text-[18px] text-[#888888] font-medium">
                    {dataMe?.current_job_position} -
                  </h1>
                  <h1 className="text-[18px] text-[#888888] ml-2 ">
                    {getLableSingle(dataMe?.level, levels)}
                  </h1>
                </div>
                <div className="flex gap-[10px] items-center my-2">
                  <MailSvg className="text-[18px]" />
                  <p className="text-[16px]">{dataMe?.email}</p>
                </div>
                <div className="flex gap-[10px] items-center my-2">
                  <PlaceSvg className="text-[18px]" />
                  <p className="text-[16px]">{dataMe?.address}</p>
                </div>
                <div className="flex gap-[10px] items-center my-2">
                  <PhoneSvg className="text-[18px]" />
                  <p className="text-[16px]">{dataMe?.phone_number}</p>
                </div>
                <div className="flex gap-[10px] items-center my-2">
                  <CalendearSvg className="text-[18px]" />
                  <p className="text-[16px]">
                    {/* {checkAndformatDate(dataMe?.date_of_birth)} */}
                  </p>
                </div>
              </div>
              <div className="">
                <div className="flex justify-end cursor-pointer ">
                  <div
                    className=" flex items-center text-white hover:bg-red-500 bg-[#d92d20] py-2 px-4 rounded-lg border"
                    onClick={() => {
                      setOpen(true);
                    }}>
                    <EditOutlined />
                    <h1 className="text-[16px]  ml-2 text-black-700 w-[80px]">
                      Sửa hồ sơ
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 mt-4">
          <h1 className="text-[22px] font-bold text-[#333] mb-2 ">
            Thông tin nghề nghiệp
          </h1>
          <div>
            <div className="flex gap-[16px] items-center my-2 pb-2">
              <h1 className="text-[14px] text-[#888888] font-medium">
                Lĩnh vực
              </h1>
              <h1 className="text-[14px]">IT</h1>
            </div>
            <div className="flex gap-[16px] pb-2 items-center">
              <h1 className="text-[14px] text-[#888888] font-medium">
                Kĩ Năng:{' '}
              </h1>
              <div className="flex gap-[16px]">
                <MyTag className="bg-[#d92d20] text-white" title="HTML" />
                <MyTag className="bg-[#d92d20] text-white" title="HTML" />
                <MyTag className="bg-[#d92d20] text-white" title="HTML" />
              </div>
            </div>

            <div className="flex gap-[16px] items-center my-2 pb-2">
              <h1 className="text-[14px] text-[#888888] font-medium">
                Học vấn
              </h1>
              <h1 className="text-[14px]">
                {getLableSingle(dataMe?.education, educationLevels)}
              </h1>
            </div>
            <div className="flex gap-[16px] items-center my-2 pb-2">
              <h1 className="text-[14px] text-[#888888] font-medium">
                Cấp bậc
              </h1>
              <h1 className="text-[14px]">
                {getLableSingle(dataMe?.levels, levels)}
              </h1>
            </div>
            <div className="flex gap-[16px] items-center my-2 v">
              <h1 className="text-[14px] text-[#888888] font-medium">
                Chức vụ mong muốn
              </h1>
              <h1 className="text-[14px]">{dataMe?.feature_job_position}</h1>
            </div>
            <div className="flex gap-[16px] items-center my-2 pb-2">
              <h1 className="text-[14px] text-[#888888] font-medium">
                Mức lương mong muốn
              </h1>
              <h1 className="text-[14px]">{dataMe?.salary_expected}</h1>
            </div>
            <div className="flex gap-[16px] items-center my-2 pb-2">
              <h1 className="text-[14px] text-[#888888] font-medium">
                Trình độ ngoại ngữ
              </h1>
              <h1 className="text-[14px]">
                {getLableSingle(dataMe?.language_level, englishSkillOptions)}
              </h1>
            </div>
          </div>
        </div>
        <ProfileModal
          title={`Cập nhật thông tin`}
          id={'2'}
          open={open}
          setOpen={setOpen}
          onCancel={() => {
            setOpen(false);
          }}
        />
      </div>
    </div>
  );
}
