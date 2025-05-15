import React, { useEffect, useState } from 'react';
import {
  DownOutlined,
  FacebookOutlined,
  SmileOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Space } from 'antd';
import { MyButton } from '@/components/basic/button';
import CardJobRec from '@/components/basic/card/CardJobRec';
import MyTag from '@/components/basic/tags/tag';
import {
  getDetailEmployer,
  getlistEnvalution,
  getlistJobForEmployer,
} from '@/api/features/candicate';
import { NavLink, useLocation, useParams } from 'react-router-dom';
import { getLableSingle } from '@/utils/helper';
import 'react-quill/dist/quill.snow.css';
import { cities, OtOption } from '@/constants/job';
import InforRecruiter from './components/InforRecruiter';
import EnvalutionRecruiter from './components/EnvalutionRecruiter';
import ProfileModal from '@/components/business/modal/profile';
import EnvalutionRecruiterModal from '@/components/business/modal/envalution';

interface Props {}

const tabs = [
  { key: '1', label: 'Giới thiệu' },
  { key: '2', label: 'Đánh giá' },
  // { key: '3', label: 'Thông tin khác' },
];

const RecruiterContainer: React.FC<Props> = ({}) => {
  const [activeTab, setActiveTab] = useState('1');
  const [data, setData] = useState<any>({});
  const [open, setOpen] = useState<any>(false);
  const [envalution, setEnvalution] = useState<any>(false);
  const [dataJob, setDataJob] = useState<any>({});

  const { id } = useParams();

  const fetchDataCompany = async (_id: string) => {
    const res = await getDetailEmployer(_id);
    if (res?.result?.applyJobs) {
      setData(res?.result?.applyJobs[0]);
    }
  };

  const fetchJobByCompany = async (_id: string) => {
    const res = await getlistJobForEmployer(_id);
    if (res?.result?.jobs) {
      setDataJob(res?.result?.jobs);
    }
  };

  const fetchEnvalution = async (_id: string) => {
    const res = await getlistEnvalution(_id);
    if (res?.result) {
      setEnvalution({
        result: res.result, // Danh sách evaluations
        rateSummary: res.rateSummary, // Thống kê rate (averageRate, rateCounts, rateDistribution)
      });
    }
  };
  useEffect(() => {
    if (id) {
      fetchDataCompany(id);
      fetchJobByCompany(id);
      fetchEnvalution(id);
    }
  }, [activeTab]);
  console.log('Data', data);
  return (
    <div className="">
      <div className=" mt-[20px] mx-auto w-[1260px]">
        <div className="flex  gap-[40px] bg-white">
          <div className="flex items-center p-4 gap-[20px] flex-1 ">
            <img
              className="w-[160px] h-[160px] object-contain rounded-sm border"
              src={
                data?.avatar ||
                'https://img.freepik.com/free-vector/contact-icon-3d-vector-illustration-blue-button-with-user-profile-symbol-networking-sites-apps-cartoon-style-isolated-white-background-online-communication-digital-marketing-concept_778687-1715.jpg'
              }
            />
            <div className="flex flex-col gap-[10px]">
              <h1 className="text-[28px]">{data?.name}</h1>
              <div className="flex items-center gap-[16px]">
                <div>
                  <p className="text-[14px]">
                    {getLableSingle(data?.city, cities)}
                  </p>
                </div>
                <div>
                  <p className="text-[14px]">
                    {dataJob?.length} việc làm đang tuyển dụng
                  </p>
                </div>
              </div>
              <div>
                <MyButton
                  className="w-[160px] !h-[50px]"
                  onClick={() => setOpen(true)}>
                  <p className="text-[14px]">Viết đánh giá</p>
                </MyButton>
                <MyButton
                  buttonType="outline"
                  className="w-[160px] !h-[50px] ml-4">
                  <p className="text-[14px]">Theo dõi</p>
                </MyButton>
              </div>
            </div>
          </div>
        </div>
        <div className="flex">
          <div className="mt-[20px]  w-2/3">
            <div className="bg-white px-4 flex items-center">
              {tabs.map(tab => (
                <div
                  key={tab.key}
                  className="px-2 py-4 mr-4 cursor-pointer"
                  onClick={() => setActiveTab(tab.key)}>
                  <h1
                    className={`text-[16px] font-bold ${
                      activeTab === tab.key ? 'text-primary' : 'text-black'
                    }`}>
                    {tab.label}
                  </h1>
                </div>
              ))}
            </div>
            {activeTab == '1' && <InforRecruiter data={data} />}
            {activeTab == '2' && <EnvalutionRecruiter data={envalution} />}
          </div>
          <div className="w-1/3 mt-[20px]">
            <div className="ml-4">
              <h1 className="text-[22px] font-bold h-[54px] flex items-center">
                {dataJob?.length} Việc làm đang tuyển dụng
              </h1>
              <div className="mt-[20px] overflow-auto max-h-[700px] pr-2">
                {dataJob?.length > 0 &&
                  dataJob?.map((item: any, index: number) => (
                    <div key={index} className="mb-[16px]">
                      <NavLink to={`/${item?._id}/job-detail`}>
                        <CardJobRec data={item} />
                      </NavLink>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
        <EnvalutionRecruiterModal
          title={`Đánh giá công ty - ${data?.name}`}
          id={id}
          open={open}
          setOpen={setOpen}
          onCancel={() => {
            setOpen(false);
          }}
        />
      </div>
    </div>
  );
};

export default RecruiterContainer;
