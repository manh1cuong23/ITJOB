import React, { useCallback, useEffect, useState } from 'react';
import { MyButton } from '@/components/basic/button';
import { ReactComponent as BackSvg } from '@/assets/icons/ic_back.svg';
import { Row, Col, Form, message, Upload, Button } from 'antd';
import { MyModal } from '@/components/basic/modal';
import { MyFormItem } from '@/components/basic/form-item';
import { InputBasic } from '../../input';
import { MyTextArea } from '@/components/basic/input';

import {
  applyJob,
  createNewJob,
  getDetailJob,
  updateJob,
} from '@/api/features/job';
import { getListFields, getListSkill } from '@/api/features/other';
import {
  MultiSelectWithSearch,
  SingleSelectSearchCustom,
} from '@/components/basic/select';
import {
  cities,
  educationLevels,
  experienceLevels,
  genders,
  jobTypes,
  levels,
} from '@/constants/job';
import MultiSelectWithSearchAdd from '@/components/basic/select/MultiSelectWithSearchAdd';
import DatepickerBasic from '../../date-picker/DatepickerBasic';
import ReactQuill from 'react-quill';
import dayjs from 'dayjs';
import { UploadOutlined } from '@ant-design/icons';
import { uploadImage } from '@/api/features/media';

const JobCruModal: React.FC<{
  id?: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onFinish?: () => void;
  setForceUpdate: any;
  onCancel?: () => void;
  title: string;
  setPageData?: (data: any) => void;
  onBack?: () => void;
  isViewMode?: boolean;
  switchEditmode?: any;
  isCreate?: boolean;
  isInAdmin?: boolean;
  handleUpLoad?: any;
}> = ({
  id,
  open,
  onFinish,
  onCancel,
  isInAdmin,
  switchEditmode,
  setForceUpdate,
  handleUpLoad,
  title,
  setPageData,
  setOpen,
  isViewMode = false,
  onBack,
  isCreate = false,
}) => {
  const [selectedValue, setSelectedValue] = useState('');

  const [content, setContent] = useState('');
  const [skill, setSkill] = useState([]);
  const [fields, setFields] = useState([]);
  const [form] = Form.useForm();
  const [imageUrl, setImageUrls] = useState('');

  const handleUpload = async ({ file }: any) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      // Giả sử uploadImage là hàm API trả về URL của ảnh
      const res = await uploadImage(formData);
      console.log('check res', res);
      const newImageUrl = res.result?.[0]?.url; // Điều chỉnh theo response của API

      // Thêm URL mới vào state
      setImageUrls(newImageUrl);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

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
  }, [open]);

  const fetchJobById = async (id: string) => {
    const response = await getDetailJob(id);
    if (response.result) {
      const data = response.result;
      const updateDate = {
        ...data,
        salaryFrom: data.salary[0],
        salaryTo: data.salary[1],
      };
      setImageUrls(data.background);
      console.log('check data', data);
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
    if (!isCreate && id && open) {
      fetchJobById(id);
    }
  }, [id, isCreate, open]);

  const handleOk = async (force: boolean = false) => {
    if (isViewMode) {
      console.log('vo day');
      switchEditmode();
    } else {
      let dataForm = await form.validateFields();
      dataForm.description = content;
      const updatedData = {
        ...dataForm, // sao chép dữ liệu cũ
        background: imageUrl,
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
      onFinish && onFinish();
      setForceUpdate((prev: number) => prev + 1);
    }
  };

  const handleCancel = () => {
    onCancel && onCancel();
    form.resetFields();
  };
  const disabledPastDates = (currentDate: dayjs.Dayjs) => {
    return currentDate && currentDate.isBefore(dayjs(), 'day');
  };
  return (
    <>
      <MyModal
        width={1200}
        title={title}
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={
          <>
            {!isInAdmin && (
              <>
                {' '}
                <MyButton onClick={handleCancel} buttonType="outline">
                  Hủy bỏ
                </MyButton>
                <MyButton onClick={() => handleOk(false)}>
                  {isViewMode ? 'Chỉnh sửa' : 'Đăng tin'}
                </MyButton>
              </>
            )}
          </>
        }>
        <div className="ml-[8px] bg-white px-4">
          <div className="  py-4">
            <p className="text-[16px] text-[#9d9d9d]">
              {!isInAdmin
                ? 'Tin tuyển dụng của bạn sẽ được kiểm duyệt trước khi đến với những ứng viên tiềm năng'
                : 'Hãy kiểm tra nội dung tuyển dụng trước khi duyệt tin.'}
            </p>
          </div>
          <div className="">
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
                        disabled={isViewMode}
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
                        disabled={isViewMode}
                        label="Địa điểm làm việc"
                        required
                        labelCol={{ span: 24 }}
                        wrapperCol={{ span: 24 }}>
                        <SingleSelectSearchCustom
                          className="change-field"
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
                        disabled={isViewMode}
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
                        disabled={isViewMode}
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
                        disabled={isViewMode}
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
                        disabled={isViewMode}
                        isSpan
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
                        disabled={isViewMode}
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
                        disabled={isViewMode}
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
                        disabled={isViewMode}
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
                        disabled={isViewMode}
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
                        disabled={isViewMode}
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
                        disabled={isViewMode}
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
                        disabledDate={disabledPastDates}
                        isSpan
                        label="Hạn Nộp"
                        disabled={isViewMode}
                        name="deadline"
                      />
                    </Col>
                  </Row>
                  <Row>
                    <MyFormItem
                      label="Thêm background tuyển dụng"
                      labelCol={{ span: 24 }}
                      wrapperCol={{ span: 24 }}>
                      <div>
                        {/* Component Upload của Ant Design */}
                        <Upload
                          customRequest={handleUpload}
                          accept="image/*"
                          multiple
                          showUploadList={false} // Tắt danh sách upload mặc định của antd
                        >
                          <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
                        </Upload>

                        {/* Hiển thị preview ảnh */}
                        <div
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            marginTop: 16,
                          }}>
                          {imageUrl && (
                            <div style={{ position: 'relative', margin: 8 }}>
                              <img
                                src={imageUrl}
                                alt={`preview-${imageUrl}`}
                                style={{
                                  width: 100,
                                  height: 100,
                                  objectFit: 'cover',
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </MyFormItem>
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
                        disabled={isViewMode}
                        labelCol={{ span: 24 }}
                        wrapperCol={{ span: 24 }}>
                        <div>
                          <ReactQuill
                            readOnly={isViewMode}
                            theme="snow"
                            value={content}
                            onChange={setContent}
                            className="h-[200px] mb-10"
                          />
                        </div>
                      </MyFormItem>
                    </Col>
                  </Row>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </MyModal>
    </>
  );
};

export default JobCruModal;
