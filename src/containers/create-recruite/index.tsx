import React, { useEffect, useState } from 'react';
import { Col, Dropdown, Form, message, Row, Space } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { InputBasic } from '@/components/business/input';
import {
  MultiSelectWithSearch,
  SingleSelectSearchCustom,
} from '@/components/basic/select';
import { MyFormItem } from '@/components/basic/form-item';
import { MyTextArea } from '@/components/basic/input';
import DatepickerBasic from '@/components/business/date-picker/DatepickerBasic';
import { MyButton } from '@/components/basic/button';
import MultiSelectWithSearchAdd from '@/components/basic/select/MultiSelectWithSearchAdd';
import {
  cities,
  educationLevels,
  experienceLevels,
  genders,
  jobTypes,
  levels,
} from '@/constants/job';
import { MultiSelectBasic } from '@/components/business/select';
import { createNewJob, getDetailJob, updateJob } from '@/api/features/job';
import { useParams } from 'react-router-dom';
import { getListFields, getListSkill } from '@/api/features/other';
interface Props {
  isCreate?: boolean;
}

const CreateRecruiterContainer: React.FC<Props> = ({ isCreate = true }) => {
  const [content, setContent] = useState('');
  const [skill, setSkill] = useState([]);
  const [fields, setFields] = useState([]);
  const { id } = useParams();
  const [form] = Form.useForm();

  const fetchSkillAndFields = async () => {
    const resSkills = await getListSkill();
    const resFields = await getListFields();
    if (resSkills && resSkills.result) {
      const skillOptions = resSkills.result.map((item: any) => ({
        label: item.name,
        value: item.name,
      }));
      setSkill(skillOptions);
    }

    if (resFields && resFields.result) {
      const fieldOptions = resFields.result.map((item: any) => ({
        label: item.name,
        value: item.name,
      }));
      setFields(fieldOptions);
    }
  };

  useEffect(() => {
    fetchSkillAndFields();
  }, []);

  const fetchJobById = async (id: string) => {
    const response = await getDetailJob(id);
    if (response.result) {
      const data = response.result;
      const updateDate = {
        ...data,
        salaryFrom: data.salary[0],
        salaryTo: data.salary[1],
      };
      const skills = data.skills_info.map((item: any, index: number) => {
        return item.name;
      });
      const fields = data.fields_info.map((item: any, index: number) => {
        return item.name;
      });
      updateDate.skills = skills;
      updateDate.fields = fields;
      setContent(data.description);
      form.setFieldsValue(updateDate);
    }
  };

  useEffect(() => {
    if (!isCreate && id) {
      fetchJobById(id);
    }
  }, [id, isCreate]);

  const handleSubmit = async () => {
    let dataForm = await form.validateFields();
    dataForm.description = content;
    const updatedData = {
      ...dataForm, // sao chép dữ liệu cũ
      salary: [dataForm.salaryFrom, dataForm.salaryTo], // thay thế salaryFrom và salaryTo bằng mảng salary
    };

    // Xóa salaryFrom và salaryTo nếu không cần nữa
    delete updatedData.salaryFrom;
    delete updatedData.salaryTo;
    if (isCreate) {
      const response = await createNewJob(updatedData);
      if (response && response.message) {
        message.success('Tạo tin tuyển dụng thành công');
      } else {
        message.error('Có lỗi xảy ra');
        return;
      }
    } else {
      if (id) {
        const response = await updateJob(updatedData, id);
        if (response && response.message) {
          message.success('Cập nhật tuyển dụng thành công');
        } else {
          message.error('Có lỗi xảy ra');
          return;
        }
      }
    }
    form.resetFields();
  };

  return (
    <div className="ml-[8px] bg-white px-[20px] pt-[20px]">
      <h2 className=" text-[22px] font-medium">
        {isCreate ? 'Đăng tin tuyển dụng mới' : 'Chỉnh sửa tin tuyển dụng'}
      </h2>
      <div className=" my-4 py-4">
        <p>
          Tin tuyển dụng của bạn sẽ được kiểm duyệt trước khi đến với những ứng
          viên tiềm năng
        </p>
      </div>
      <div className="px-[40px]">
        <Form form={form}>
          <div className="flex ">
            <div className="w-1/6  mt-[14px]">
              <p>Tiêu đề công việc</p>
            </div>
            <div className="w-5/6">
              <Row gutter={16}>
                <Col
                  xs={24} // Chiếm 100% chiều rộng màn hình nhỏ (xs)
                  sm={24} // Chiếm 19/24 phần chiều rộng màn hình nhỏ hơn sm (80% chiều rộng)
                  md={12} // Chiếm 19/24 phần màn hình cỡ trung bình (md)
                  lg={12} // Chiếm 19/24 phần màn hình cỡ lớn (lg)
                  xl={12} // Chiếm 19/24 phần màn hình cực lớn (xl)
                >
                  <InputBasic
                    label="Tiêu đề tuyển dụng"
                    name="name"
                    isSpan
                    required
                  />
                </Col>
              </Row>
            </div>
          </div>
          <div className="flex">
            <div className="w-1/6  mt-[14px]">
              <p>Thông tin chung</p>
            </div>
            <div className="w-5/6">
              <Row gutter={16}>
                <Col
                  xs={24} // Chiếm 100% chiều rộng màn hình nhỏ (xs)
                  sm={24} // Chiếm 19/24 phần chiều rộng màn hình nhỏ hơn sm (80% chiều rộng)
                  md={12} // Chiếm 19/24 phần màn hình cỡ trung bình (md)
                  lg={12} // Chiếm 19/24 phần màn hình cỡ lớn (lg)
                  xl={12} // Chiếm 19/24 phần màn hình cực lớn (xl)
                >
                  <MyFormItem
                    name="city"
                    label="Địa điểm làm việc"
                    required
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}>
                    <MultiSelectWithSearch
                      className="change-field"
                      maxTagCount={3}
                      options={cities}
                    />
                  </MyFormItem>
                </Col>
                <Col
                  xs={24} // Chiếm 100% chiều rộng màn hình nhỏ (xs)
                  sm={24} // Chiếm 19/24 phần chiều rộng màn hình nhỏ hơn sm (80% chiều rộng)
                  md={12} // Chiếm 19/24 phần màn hình cỡ trung bình (md)
                  lg={12} // Chiếm 19/24 phần màn hình cỡ lớn (lg)
                  xl={12} // Chiếm 19/24 phần màn hình cực lớn (xl)
                >
                  <MyFormItem
                    name="type_work"
                    label="Phương thức làm việc"
                    required
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}>
                    <MultiSelectWithSearch options={jobTypes} />
                  </MyFormItem>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col
                  xs={24} // Chiếm 100% chiều rộng màn hình nhỏ (xs)
                  sm={24} // Chiếm 19/24 phần chiều rộng màn hình nhỏ hơn sm (80% chiều rộng)
                  md={12} // Chiếm 19/24 phần màn hình cỡ trung bình (md)
                  lg={12} // Chiếm 19/24 phần màn hình cỡ lớn (lg)
                  xl={12} // Chiếm 19/24 phần màn hình cực lớn (xl)
                >
                  <MyFormItem
                    name="fields"
                    label="Lĩnh Vực"
                    required
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}>
                    <MultiSelectWithSearchAdd
                      className="change-field"
                      maxTagCount={3}
                      options={fields}
                    />
                  </MyFormItem>
                </Col>
                <Col
                  xs={24} // Chiếm 100% chiều rộng màn hình nhỏ (xs)
                  sm={24} // Chiếm 19/24 phần chiều rộng màn hình nhỏ hơn sm (80% chiều rộng)
                  md={12} // Chiếm 19/24 phần màn hình cỡ trung bình (md)
                  lg={12} // Chiếm 19/24 phần màn hình cỡ lớn (lg)
                  xl={6} // Chiếm 19/24 phần màn hình cực lớn (xl)
                >
                  <MyFormItem
                    name="level"
                    label="Cấp bậc"
                    required
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}>
                    <SingleSelectSearchCustom
                      placeholder="Chọn"
                      options={levels}
                    />
                  </MyFormItem>
                </Col>
                <Col
                  xs={24} // Chiếm 100% chiều rộng màn hình nhỏ (xs)
                  sm={24} // Chiếm 19/24 phần chiều rộng màn hình nhỏ hơn sm (80% chiều rộng)
                  md={12} // Chiếm 19/24 phần màn hình cỡ trung bình (md)
                  lg={12} // Chiếm 19/24 phần màn hình cỡ lớn (lg)
                  xl={6} // Chiếm 19/24 phần màn hình cực lớn (xl)
                >
                  <InputBasic
                    label="Số lượng cần tuyển"
                    name="num_of_employees"
                    isSpan
                    isCode
                    required
                  />
                </Col>
              </Row>
              <Row gutter={16}>
                <Col
                  xs={24} // Chiếm 100% chiều rộng màn hình nhỏ (xs)
                  sm={24} // Chiếm 19/24 phần chiều rộng màn hình nhỏ hơn sm (80% chiều rộng)
                  md={12} // Chiếm 19/24 phần màn hình cỡ trung bình (md)
                  lg={12} // Chiếm 19/24 phần màn hình cỡ lớn (lg)
                  xl={12} // Chiếm 19/24 phần màn hình cực lớn (xl)
                >
                  <MyFormItem
                    name="skills"
                    label="Kỹ Năng"
                    required
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}>
                    <MultiSelectWithSearchAdd
                      className="change-field"
                      maxTagCount={3}
                      options={skill}
                    />
                  </MyFormItem>
                </Col>
              </Row>
            </div>
          </div>
          <div className="flex">
            <div className="w-1/6 mt-[14px]">
              <p>Thông tin công việc</p>
            </div>
            <div className="w-5/6">
              <Row gutter={16}>
                <Col
                  xs={24} // Chiếm 100% chiều rộng màn hình nhỏ (xs)
                  sm={24} // Chiếm 19/24 phần chiều rộng màn hình nhỏ hơn sm (80% chiều rộng)
                  md={12} // Chiếm 19/24 phần màn hình cỡ trung bình (md)
                  lg={12} // Chiếm 19/24 phần màn hình cỡ lớn (lg)
                  xl={8} // Chiếm 19/24 phần màn hình cực lớn (xl)
                >
                  <MyFormItem
                    name="gender"
                    label="Giới tính"
                    required
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}>
                    <MultiSelectWithSearch options={genders} />
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
                    name="education"
                    label="Trình độ"
                    required
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}>
                    <SingleSelectSearchCustom
                      className="change-field"
                      options={educationLevels}
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
                    name="year_experience"
                    label="Kinh nghiệm"
                    required
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}>
                    <SingleSelectSearchCustom
                      className="change-field"
                      options={experienceLevels}
                    />
                  </MyFormItem>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col
                  xs={24} // Chiếm 100% chiều rộng màn hình nhỏ (xs)
                  sm={24} // Chiếm 19/24 phần chiều rộng màn hình nhỏ hơn sm (80% chiều rộng)
                  md={12} // Chiếm 19/24 phần màn hình cỡ trung bình (md)
                  lg={12} // Chiếm 19/24 phần màn hình cỡ lớn (lg)
                  xl={8} // Chiếm 19/24 phần màn hình cực lớn (xl)
                >
                  <InputBasic
                    label="Mức lương từ"
                    name="salaryFrom"
                    isSpan
                    isCode
                    required
                  />
                </Col>
                <Col
                  xs={24} // Chiếm 100% chiều rộng màn hình nhỏ (xs)
                  sm={24} // Chiếm 19/24 phần chiều rộng màn hình nhỏ hơn sm (80% chiều rộng)
                  md={12} // Chiếm 19/24 phần màn hình cỡ trung bình (md)
                  lg={12} // Chiếm 19/24 phần màn hình cỡ lớn (lg)
                  xl={8} // Chiếm 19/24 phần màn hình cực lớn (xl)
                >
                  <InputBasic
                    label="Đến"
                    name="salaryTo"
                    isSpan
                    isCode
                    required
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
                  <DatepickerBasic
                    required
                    isSpan
                    label="Hạn Nộp"
                    name="deadline"
                  />
                </Col>
              </Row>
              <Row gutter={16}>
                <Col
                  xs={24} // Chiếm 100% chiều rộng màn hình nhỏ (xs)
                  sm={24} // Chiếm 19/24 phần chiều rộng màn hình nhỏ hơn sm (80% chiều rộng)
                  md={12} // Chiếm 19/24 phần màn hình cỡ trung bình (md)
                  lg={12} // Chiếm 19/24 phần màn hình cỡ lớn (lg)
                  xl={24} // Chiếm 19/24 phần màn hình cực lớn (xl)
                >
                  <MyFormItem
                    name="description"
                    label="Mô tả công việc"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}>
                    <div>
                      <ReactQuill
                        theme="snow"
                        value={content}
                        onChange={setContent}
                        style={{ height: '200px', marginBottom: '80px' }}
                      />
                    </div>
                  </MyFormItem>
                </Col>
              </Row>
              <div className="flex justify-end gap-[16px]">
                <MyButton buttonType="outline">Xem trước</MyButton>
                <MyButton onClick={handleSubmit}>
                  {isCreate ? 'Đăng Tin' : 'Cập nhật'}
                </MyButton>
              </div>
            </div>
          </div>
          <div className="flex justify-end mb-[50px] mt-[20px]"></div>
        </Form>
      </div>
    </div>
  );
};

export default CreateRecruiterContainer;
