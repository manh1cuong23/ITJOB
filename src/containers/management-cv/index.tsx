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
import { formatCurrency, getLableSingle } from '@/utils/helper';
import { experienceLevels } from '@/constants/job';
import MyTag from '@/components/basic/tags/tag';
import { NavLink } from 'react-router-dom';
import { getListFields, getListSkill } from '@/api/features/other';
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
    title: 'Lĩnh vực',
    dataIndex: 'fields',
    key: 'fields',
    render: (fields: any) => fields?.map((item: any) => item.name).join(', '),
  },
  {
    title: 'Mức Lương mong muốn',
    dataIndex: 'salary_expected',
    key: 'salary_expected',
    render: (salary_expected: any) => formatCurrency(salary_expected),
  },
  {
    title: 'Kỹ năng',
    dataIndex: 'skills',
    key: 'skills',
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
      </div>
    ),
  },
];
const ManagementCandicateContainer: React.FC = () => {
  const [data, setData] = useState<any>([]);
  const [skills, setSkill] = useState([]);
  const [fields, setFields] = useState([]);
  const [form] = Form.useForm();

  const handleClickSeach = async () => {
    const data = await form.validateFields();
    console.log('data form', data);
    await fetchAllCV(data);
  };

  const fetchSkillAndFields = async () => {
    const resSkills = await getListSkill();
    const resFields = await getListFields();
    if (resSkills && resSkills.result) {
      const skillOptions = resSkills.result.map((item: any) => ({
        label: item.name,
        value: item._id,
      }));
      setSkill(skillOptions);
    }

    if (resFields && resFields.result) {
      const fieldOptions = resFields.result.map((item: any) => ({
        label: item.name,
        value: item._id,
      }));
      setFields(fieldOptions);
    }
  };
  const fetchAllCV = async (data?: any) => {
    const res = await getListCandicate(data);
    if (res.result) {
      console.log('res?.result', res.result);
      const data = res.result?.map((item: any) => ({
        email: item.email,
        ...item.candidate_info,
        skills: item?.skills_info,
        fields: item?.fields_info,
      }));
      setData(data);
    }
  };

  useEffect(() => {
    fetchSkillAndFields();

    fetchAllCV();
  }, []);

  return (
    <div className="w-full">
      <div className="bg-white m-[20px]">
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
                    name="fields"
                    label="Lĩnh Vực"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}>
                    <MultiSelectWithSearch
                      className="change-field"
                      options={fields}
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
                    name="skills"
                    label="Kỹ năng"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}>
                    <MultiSelectWithSearch
                      className="change-field"
                      options={skills}
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
      <div className="bg white  m-[20px]">
        <div className=" w-full ">
          <TableBasic
            defaultScroolY={4}
            dataSource={data}
            columns={columns}
            isPaginationClient
          />
        </div>
      </div>
    </div>
  );
};

export default ManagementCandicateContainer;
