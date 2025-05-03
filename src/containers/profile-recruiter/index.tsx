import React, { useEffect, useState } from 'react';
import {
  Button,
  Col,
  Dropdown,
  Form,
  Input,
  message,
  Row,
  Space,
  Upload,
} from 'antd';
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
import { getMe, updateMe } from '@/api/features/user';
import { mapFieldsToOptions } from '@/utils/helper';
import { uploadImage } from '@/api/features/media';
import { UploadOutlined } from '@ant-design/icons';
interface Props {
  isCreate?: boolean;
}

const ProfileRecruiterPage: React.FC<Props> = ({ isCreate = true }) => {
  const [content, setContent] = useState('');
  const [dataImg, setDataImg] = useState<any>({});
  const [skill, setSkill] = useState([]);
  const [fields, setFields] = useState([]);
  const { id } = useParams();
  const [form] = Form.useForm();
  const [imageUrls, setImageUrls] = useState<any>([]);

  // Hàm xử lý upload ảnh
  const handleUpload = async ({ file }: any) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      // Giả sử uploadImage là hàm API trả về URL của ảnh
      const res = await uploadImage(formData);
      console.log('check res', res);
      const newImageUrl = res.result?.[0]?.url; // Điều chỉnh theo response của API

      // Thêm URL mới vào state
      setImageUrls((prevUrls: any) => [...prevUrls, newImageUrl]);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };
  console.log('check', imageUrls);
  // Hàm xóa ảnh khỏi state
  const handleRemove = (url: any) => {
    setImageUrls((prevUrls: any) =>
      prevUrls.filter((item: any) => item !== url)
    );
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
  }, []);

  const fetchMe = async () => {
    const response = await getMe();
    if (response.result) {
      const { employer_info, fields_info, skills_info } = response.result;
      console.log('check', response.result);
      setDataImg({
        avatar: { url: employer_info?.avatar },
        background: { url: employer_info?.cover_photo },
      });
      employer_info.fields = mapFieldsToOptions(fields_info);
      employer_info.skills = mapFieldsToOptions(skills_info);
      employer_info.isOt = employer_info.isOt ? 1 : 0;
      setContent(employer_info.description);
      setImageUrls(employer_info?.images);
      form.setFieldsValue(employer_info);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const handleSubmit = async () => {
    let dataForm = await form.validateFields();
    dataForm.description = content;
    dataForm.isOt = dataForm.isOt ? true : false;
    dataForm.avatar = dataImg?.avatar?.url;
    dataForm.cover_photo = dataImg?.background?.url;
    console.log(dataForm);
    // Xóa salaryFrom và salaryTo nếu không cần nữa
    const response = await updateMe({
      employer_body: { ...dataForm, images: imageUrls },
    });
    if (response && response.message) {
      message.success('Cập nhật thông tin thành công');
    } else {
      message.error('Có lỗi xảy ra');
      return;
    }

    // form.resetFields();
  };

  const handleChaneAvatar = async (event: any) => {
    const formData = new FormData();
    formData.append('image', event.target.files[0]);
    const res = await uploadImage(formData);
    if (res?.result) {
      console.log('res?.re', res?.result);
      setDataImg((prev: any) => ({
        ...prev,
        avatar: res?.result[0], // nên dùng optional chaining đầy đủ
      }));
    }
  };

  const handleChangeBackground = async (event: any) => {
    const formData = new FormData();
    formData.append('image', event.target.files[0]);
    const res = await uploadImage(formData);
    if (res?.result) {
      setDataImg((prev: any) => ({
        ...prev,
        background: res?.result?.[0], // nên dùng optional chaining đầy đủ
      }));
    }
  };

  return (
    <div className="ml-[8px] bg-white px-[20px] pt-[20px]">
      <h2 className=" text-[22px] font-bold">Cập nhật thông tin công ty</h2>

      <div className="px-[50px]">
        <Form form={form}>
          <div className="flex ">
            <div className="w-5/6">
              <Row gutter={16}>
                <Col
                  xs={24} // Chiếm 100% chiều rộng màn hình nhỏ (xs)
                  sm={24} // Chiếm 19/24 phần chiều rộng màn hình nhỏ hơn sm (80% chiều rộng)
                  md={12} // Chiếm 19/24 phần màn hình cỡ trung bình (md)
                  lg={12} // Chiếm 19/24 phần màn hình cỡ lớn (lg)
                  xl={12} // Chiếm 19/24 phần màn hình cực lớn (xl)
                >
                  <InputBasic label="Tên công ty" name="name" isSpan required />
                </Col>
              </Row>
            </div>
          </div>
          <div className="flex">
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
                  <InputBasic label="Địa chỉ" name="address" isSpan required />
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
              <Row gutter={16}>
                <Col
                  xs={24} // Chiếm 100% chiều rộng màn hình nhỏ (xs)
                  sm={24} // Chiếm 19/24 phần chiều rộng màn hình nhỏ hơn sm (80% chiều rộng)
                  md={12} // Chiếm 19/24 phần màn hình cỡ trung bình (md)
                  lg={12} // Chiếm 19/24 phần màn hình cỡ lớn (lg)
                  xl={12} // Chiếm 19/24 phần màn hình cực lớn (xl)
                >
                  <InputBasic
                    name="date_working"
                    label="Ngày làm việc"
                    isSpan
                  />
                </Col>
                <Col
                  xs={24} // Chiếm 100% chiều rộng màn hình nhỏ (xs)
                  sm={24} // Chiếm 19/24 phần chiều rộng màn hình nhỏ hơn sm (80% chiều rộng)
                  md={12} // Chiếm 19/24 phần màn hình cỡ trung bình (md)
                  lg={12} // Chiếm 19/24 phần màn hình cỡ lớn (lg)
                  xl={12} // Chiếm 19/24 phần màn hình cực lớn (xl)
                >
                  <InputBasic
                    name="time_working"
                    label="Thời gian làm việc"
                    isSpan
                  />
                </Col>
              </Row>
            </div>
          </div>
          <div className="flex">
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
                    label="Số lượng nhân viên"
                    name="employer_size"
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
                  xl={12} // Chiếm 19/24 phần màn hình cực lớn (xl)
                >
                  <MyFormItem
                    name="isOt"
                    label="Làm việc ngoài giờ"
                    required
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}>
                    <SingleSelectSearchCustom
                      className="change-field"
                      options={[
                        { label: 'Có làm thêm ngoài giờ', value: 1 },
                        { label: 'Không làm thêm ngoài giờ', value: 0 },
                      ]}
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
                  xl={12} // Chiếm 19/24 phần màn hình cực lớn (xl)
                >
                  <MyFormItem
                    label="Logo"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}>
                    <Input type="file" onChange={handleChaneAvatar} />
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
                    label="Hình nền"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}>
                    <Input type="file" onChange={handleChangeBackground} />
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
                  <div>
                    {dataImg?.avatar?.url && (
                      <img
                        src={dataImg?.avatar?.url}
                        className="max-h-[300px]"
                      />
                    )}
                  </div>
                </Col>
                <Col
                  xs={24} // Chiếm 100% chiều rộng màn hình nhỏ (xs)
                  sm={24} // Chiếm 19/24 phần chiều rộng màn hình nhỏ hơn sm (80% chiều rộng)
                  md={12} // Chiếm 19/24 phần màn hình cỡ trung bình (md)
                  lg={12} // Chiếm 19/24 phần màn hình cỡ lớn (lg)
                  xl={12} // Chiếm 19/24 phần màn hình cực lớn (xl)
                >
                  <div>
                    {dataImg?.background?.url && (
                      <img
                        src={dataImg?.background?.url}
                        className="max-h-[300px]"
                      />
                    )}
                  </div>
                </Col>
              </Row>
              <Col
                xs={24} // Chiếm 100% chiều rộng màn hình nhỏ (xs)
                sm={24} // Chiếm 19/24 phần chiều rộng màn hình nhỏ hơn sm (80% chiều rộng)
                md={12} // Chiếm 19/24 phần màn hình cỡ trung bình (md)
                lg={12} // Chiếm 19/24 phần màn hình cỡ lớn (lg)
                xl={12} // Chiếm 19/24 phần màn hình cực lớn (xl)
              >
                <MyFormItem
                  label="Hình ảnh công ty"
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
                      {imageUrls.map((url: any, index: any) => (
                        <div
                          key={index}
                          style={{ position: 'relative', margin: 8 }}>
                          <img
                            src={url}
                            alt={`preview-${index}`}
                            style={{
                              width: 100,
                              height: 100,
                              objectFit: 'cover',
                            }}
                          />
                          <Button
                            size="small"
                            style={{ position: 'absolute', top: 0, right: 0 }}
                            onClick={() => handleRemove(url)}>
                            X
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </MyFormItem>
              </Col>
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
                    label="Giới thiệu công ty"
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
              <div className="flex  gap-[16px]">
                <MyButton onClick={handleSubmit}>Cập nhật thông tin</MyButton>
              </div>
            </div>
          </div>
          <div className="flex justify-end mb-[50px] mt-[20px]"></div>
        </Form>
      </div>
    </div>
  );
};

export default ProfileRecruiterPage;
