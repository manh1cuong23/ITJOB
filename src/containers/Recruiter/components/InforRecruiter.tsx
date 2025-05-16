import { ReactComponent as ProfileSvg } from '@/assets/icons/ic_user.svg';
import MyTag from '@/components/basic/tags/tag';
import { OtOption } from '@/constants/job';
import { getLableSingle } from '@/utils/helper';
import { FacebookOutlined } from '@ant-design/icons';
import { NavLink, useLocation } from 'react-router-dom';

export default function InforRecruiter({ data }: any) {
  console.log('data', data);
  const gioithie = [
    {
      title: 'Mô hình công ty',
      descriptiopn: data?.fields_info?.[0]?.name,
    },

    {
      title: 'Lĩnh vực công ty',
      descriptiopn: data?.fields_info?.map((item: any) => item.name).join(', '),
    },
    {
      title: 'Quy mô công ty',
      descriptiopn: data?.employer_size,
    },
    {
      title: 'Địa chỉ',
      descriptiopn: data?.address,
    },
    {
      title: 'Thời gian làm việc',
      descriptiopn: data?.date_working,
    },
    {
      title: 'làm việc ngoài giờ',
      descriptiopn: getLableSingle(data?.isOt ? 1 : 0, OtOption),
    },
  ];
  return (
    <div className="overflow-auto max-h-[700px] mt-4">
      <div className=" bg-white px-4  py-4 ">
        <h1 className="font-bold text-[24px] pb-4 border-b">Thông tin chung</h1>
        <div className="mt-4 flex flex-wrap">
          {gioithie.map((item, index) => (
            <div className="w-1/3">
              <div className="m-2">
                <h1 className=" text-[14px] text-gray-600">{item.title}</h1>
                <h1 className=" text-[16px] text-black">{item.descriptiopn}</h1>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 bg-white px-4 py-4">
        <h1 className="font-bold text-[24px] pb-4 border-b">
          Giới thiệu công ty
        </h1>
        <div dangerouslySetInnerHTML={{ __html: data?.description }} />
        <div className="py-4">
          <div className="flex items-center justify-center py-2 horver:bg-red-500 gap-[2px] text-[#0e2eed] border w-[200px]">
            <FacebookOutlined className="text-[16px]" />
            <h1 className="text-center text-[16px]  font-bold">
              Website công ty
            </h1>
          </div>
        </div>
      </div>

      <div className="mt-4 bg-white px-4  py-4">
        <h1 className="font-bold text-[24px] pb-4 border-b">Chuyên môn</h1>
        <div className="mt-4">
          <h1 className="text-[16px] font-medium">Our key skills</h1>
          <div className="flex gap-[16px] mt-4">
            {data?.skills_info?.map((item: any) => (
              <MyTag title={item?.name} />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 bg-white px-4  py-4">
        <h1 className="font-bold text-[24px] pb-4 border-b">
          Hình ảnh công ty
        </h1>
        <div className="flex flex-wrap">
          {data?.images?.length > 0 &&
            data?.images?.map((item: any) => (
              <div className="p-2 w-1/4">
                <img src={item} className=" min-h-[100px] max-h-[200px]" />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
