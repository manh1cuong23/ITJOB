import { MyButton } from '@/components/basic/button';
import { MyFormItem } from '@/components/basic/form-item';
import {
  MultiSelectWithSearch,
  SingleSelectSearchCustom,
} from '@/components/basic/select';
import { TableBasic } from '@/components/basic/table';
import { InputBasic } from '@/components/business/input';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Col, Form, Row, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import BackgroundCandidate from '../job-result/components/BackgroundCandidate';
import { getListCandicate } from '@/api/features/recruite';
import { getLableSingle } from '@/utils/helper';
import { experienceLevels } from '@/constants/job';
import MyTag from '@/components/basic/tags/tag';
import { NavLink } from 'react-router-dom';
const columns: any = [
  {
    title: 'Ứng viên',
    dataIndex: 'CV',
    key: 'CV',
    width: 500,
    render: (_: any, record: any) => {
      return <BackgroundCandidate data={record} />;
    },
  },
  {
    title: 'Kinh nghiệm',
    dataIndex: 'experience_years',
    key: 'experience_years',
    render: (experience_years: any) =>
      getLableSingle(experience_years, experienceLevels),
  },
  {
    title: 'Mức Lương mong muốn',
    dataIndex: 'salary_expected',
    key: 'salary_expected',
  },
  {
    title: 'Kỹ năng',
    dataIndex: 'skills',
    key: 'skills',
    width: 300,
    render: (skills: any) => {
      return (
        <div className="w-full flex flex-wrap">
          {skills.map((item: any) => (
            <div className="p-1">
              <MyTag
                className=" !margin-[0px] bg-[#ED4E6B]  text-white "
                title={item?.name}
              />
            </div>
          ))}
        </div>
      );
    },
  },
  {
    title: 'Hành động',
    dataIndex: 'service',
    key: 'service',
    width: 160,
    align: 'center',
    render: (_: any, record: any) => (
      <div className="flex items-center gap-[16px] justify-center">
        <NavLink to={`/recruiter/cv/${record?._id}/detail/invite`}>
          <EyeOutlined className="text-blue-500 text-[16px] cursor-pointer p-1 rounded-md hover:bg-gray-200" />
        </NavLink>
        <EditOutlined className="text-green-500 cursor-pointer p-1 rounded-md hover:bg-gray-200" />
        <DeleteOutlined className="text-red-500 cursor-pointer p-1 rounded-md hover:bg-gray-200" />
      </div>
    ),
  },
];
const dataSource = [
  {
    key: '1',
    experience: '5 năm',
    salary: '12 - 14 triệu',
    place: 'Hà Nội',
  },
  {
    key: '2',
    experience: '5 năm',
    salary: '12 - 14 triệu',
    place: 'Hà Nội',
  },
  {
    key: '3',
    experience: '5 năm',
    salary: '12 - 14 triệu',
    place: 'Hà Nội',
  },
  {
    key: '4',
    experience: '5 năm',
    salary: '12 - 14 triệu',
    place: 'Hà Nội',
  },
  {
    key: '5',
    experience: '5 năm',
    salary: '12 - 14 triệu',
    place: 'Hà Nội',
  },
];
const ManagementCandicateContainer: React.FC = () => {
  const [data, setData] = useState([]);
  const [form] = Form.useForm();

  const handleClickSeach = async () => {
    const data = await form.validateFields();
    console.log('data form', data);
    await fetchAllCV(data);
  };

  const fetchAllCV = async (data?: any) => {
    const res = await getListCandicate(data);
    if (res.result) {
      const data = res.result?.map((item: any) => ({
        email: item.email,
        ...item.candidate_info,
        skills: item?.skills_info,
      }));
      setData(data);
    }
  };

  useEffect(() => {
    fetchAllCV();
  }, []);

  return (
    <div className="w-full">
      <div className="bg-white mt-4 mx-[40px]">
        <div className="w-[1200px] mx-auto py-4">
          <div className="">
            <Form form={form}>
              <Row gutter={16}>
                <Col
                  xs={24} // Chiếm 100% chiều rộng màn hình nhỏ (xs)
                  sm={24} // Chiếm 19/24 phần chiều rộng màn hình nhỏ hơn sm (80% chiều rộng)
                  md={12} // Chiếm 19/24 phần màn hình cỡ trung bình (md)
                  lg={12} // Chiếm 19/24 phần màn hình cỡ lớn (lg)
                  xl={8} // Chiếm 19/24 phần màn hình cực lớn (xl)
                >
                  <InputBasic
                    label="Nội dung hồ sơ"
                    name="name"
                    isSpan
                    isCode
                    placeholder="Tìm kiếm theo tên,chức vụ"
                    //   form={form}
                  />
                </Col>
                <Col
                  xs={24} // Chiếm 100% chiều rộng màn hình nhỏ (xs)
                  sm={24} // Chiếm 19/24 phần chiều rộng màn hình nhỏ hơn sm (80% chiều rộng)
                  md={12} // Chiếm 19/24 phần màn hình cỡ trung bình (md)
                  lg={12} // Chiếm 19/24 phần màn hình cỡ lớn (lg)
                  xl={8} // Chiếm 19/24 phần màn hình cực lớn (xl)
                >
                  <MyFormItem
                    name="changeFields"
                    label="Ngành nghề"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}>
                    <SingleSelectSearchCustom
                      className="change-field"
                      options={[]}
                    />
                  </MyFormItem>
                </Col>
                <Col
                  xs={24} // Chiếm 100% chiều rộng màn hình nhỏ (xs)
                  sm={24} // Chiếm 19/24 phần chiều rộng màn hình nhỏ hơn sm (80% chiều rộng)
                  md={12} // Chiếm 19/24 phần màn hình cỡ trung bình (md)
                  lg={12} // Chiếm 19/24 phần màn hình cỡ lớn (lg)
                  xl={8} // Chiếm 19/24 phần màn hình cực lớn (xl)
                >
                  <MyFormItem
                    name="changeFields"
                    label="Kỹ năng"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}>
                    <MultiSelectWithSearch
                      className="change-field"
                      options={[]}
                    />
                  </MyFormItem>
                </Col>
              </Row>
              <div className="flex justify-end mt-3">
                <MyButton onClick={handleClickSeach}>
                  <span>Tìm kiếm</span>
                </MyButton>
              </div>
            </Form>
          </div>
        </div>
      </div>
      <div className="bg white px-[40px] mt-[20px]">
        <div className=" w-full h-[800px]">
          <TableBasic dataSource={data} columns={columns} isPaginationClient />
        </div>
      </div>
    </div>
  );
};

export default ManagementCandicateContainer;
