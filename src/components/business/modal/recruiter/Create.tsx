import React, { useCallback, useEffect, useState } from 'react';
import { MyButton } from '@/components/basic/button';
import { ReactComponent as BackSvg } from '@/assets/icons/ic_back.svg';
import { Row, Col, Form, message } from 'antd';
import { MyModal } from '@/components/basic/modal';
import { MyFormItem } from '@/components/basic/form-item';
import { InputBasic } from '../../input';
import { MyTextArea } from '@/components/basic/input';
import { applyJob } from '@/api/features/job';
import DatepickerBasic from '../../date-picker/DatepickerBasic';
import {
  MultiSelectWithSearch,
  SingleSelectSearchCustom,
} from '@/components/basic/select';
import {
  educationLevels,
  englishSkillOptions,
  experienceLevels,
  genders,
  levels,
} from '@/constants/job';
import MultiSelectWithSearchAdd from '@/components/basic/select/MultiSelectWithSearchAdd';
import { getListFields, getListSkill } from '@/api/features/other';

const CreateRecruiteModal: React.FC<{
  id?: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onFinish?: (value: any) => void;
  onCancel?: () => void;
  title: string;
  setPageData?: (data: any) => void;
  onBack?: () => void;
  isViewMode?: boolean;
}> = ({
  id,
  open,
  onFinish,
  onCancel,
  title,
  setPageData,
  setOpen,
  isViewMode = false,
  onBack,
}) => {
  const [form] = Form.useForm();
  const [selectedValue, setSelectedValue] = useState('');
  const [skill, setSkill] = useState([]);
  const [fields, setFields] = useState([]);

  const resetForm = () => {
    form.resetFields();
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

  const handleChange = (e: any) => {
    setSelectedValue(e.target.value);
  };

  const handleOk = async (force: boolean = false) => {
    const data = await form.validateFields();
    console.log('data', data);
    if (id && data) {
      const res = await applyJob(id, data);
      if (res && res.message) {
        message.success('Bạn đã ứng tuyển thành công!');
        onCancel && onCancel();
      }
      console.log('res', res);
    }
  };

  const handleCancel = () => {
    onCancel && onCancel();
    form.resetFields();
  };

  return (
    <>
      <MyModal
        width={880}
        title={title}
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={
          <>
            <MyButton onClick={handleCancel} buttonType="outline">
              Hủy bỏ
            </MyButton>
            <MyButton onClick={() => handleOk(false)}>Cập nhật</MyButton>
          </>
        }>
        <Form form={form} layout="vertical" disabled={isViewMode}>
          <div className="">
            <div className="flex px-4">
              <div className="w-[180px] mt-2 mr-3">
                <h1 className="text-[20px] font-medium">Thông tin cơ bản</h1>
              </div>
              <div className="w-2/3">
                <Row>
                  <Col span={24}>
                    <InputBasic required isSpan label="Họ và tên" name="name" />
                  </Col>
                  <Col span={24}>
                    <InputBasic
                      required
                      isSpan
                      label="Số điện thoại"
                      name="phone_number"
                    />
                  </Col>
                  <Col span={24}>
                    <InputBasic
                      required
                      isSpan
                      label="Email liên hệ"
                      name="email"
                    />
                  </Col>
                  <Col span={24}>
                    <InputBasic
                      required
                      isSpan
                      label="Quê quán"
                      name="address"
                    />
                  </Col>
                  <Col span={24}>
                    <DatepickerBasic
                      required
                      isSpan
                      label="Ngày sinh"
                      name="birthday"
                    />
                  </Col>
                </Row>
              </div>
            </div>
            <div className="flex px-4 mt-2">
              <div className="w-[180px] mt-2 mr-3">
                <h1 className="text-[20px] font-medium">Thông tin công việc</h1>
              </div>
              <div className="w-2/3">
                <Row gutter={16}>
                  <Col span={24}>
                    <InputBasic
                      required
                      isSpan
                      label="Vị trí hiện tại"
                      name="position"
                    />
                  </Col>
                  <Col span={24}>
                    <InputBasic
                      required
                      isSpan
                      label="Vị trí mong muốn"
                      name="position"
                    />
                  </Col>
                  <Col span={24}>
                    <InputBasic
                      required
                      isSpan
                      label="Mức lương mong muốn"
                      name="position"
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
                    <MyFormItem
                      name="level"
                      label="Tiếng anh"
                      required
                      labelCol={{ span: 24 }}
                      wrapperCol={{ span: 24 }}>
                      <SingleSelectSearchCustom
                        placeholder="Chọn"
                        options={englishSkillOptions}
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
                      label="Học vấn"
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
                    md={24} // Chiếm 19/24 phần màn hình cỡ trung bình (md)
                    lg={24} // Chiếm 19/24 phần màn hình cỡ lớn (lg)
                    xl={24} // Chiếm 19/24 phần màn hình cực lớn (xl)
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
          </div>
        </Form>
      </MyModal>
    </>
  );
};

export default CreateRecruiteModal;
