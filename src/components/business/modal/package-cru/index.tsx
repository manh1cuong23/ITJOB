import React, { useCallback, useEffect, useState } from 'react';
import { MyButton } from '@/components/basic/button';
import { ReactComponent as BackSvg } from '@/assets/icons/ic_back.svg';
import { Row, Col, Form, message } from 'antd';
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
import {
  createNewPackage,
  getDetaildPackage,
  updatePackage,
} from '@/api/features/package';

const PackageCruModal: React.FC<{
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
}> = ({
  id,
  open,
  onFinish,
  onCancel,
  isInAdmin,
  switchEditmode,
  setForceUpdate,
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

  const fetchPackageById = async (id: string) => {
    const response = await getDetaildPackage(id);
    if (response.result) {
      const data = response.result;
      form.setFieldsValue(data);
    }
  };
  useEffect(() => {
    if (id) {
      fetchPackageById(id);
    }
  }, [open]);

  useEffect(() => {
    if (!isCreate && id && open) {
    }
  }, [id, isCreate, open]);

  const handleOk = async (force: boolean = false) => {
    if (isViewMode) {
      switchEditmode();
    } else {
      let dataForm = await form.validateFields();

      // Xóa salaryFrom và salaryTo nếu không cần nữa

      if (isCreate) {
        const response = await createNewPackage(dataForm);
        if (response && response.message) {
          message.success('Thêm mới gói thành công');
        } else {
          message.error('Có lỗi xảy ra');
          return;
        }
      } else {
        if (id) {
          const response = await updatePackage(id, dataForm);
          if (response && response.message) {
            message.success('Cập nhật gói thành công');
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
  return (
    <>
      <MyModal
        width={800}
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
                  {isViewMode ? 'Chỉnh sửa' : 'Lưu lại'}
                </MyButton>
              </>
            )}
          </>
        }>
        <div className="ml-[8px] bg-white px-4">
          <div className="">
            <Form form={form}>
              <Row gutter={16}>
                <Col
                  xs={24} // Chiếm 100% chiều rộng màn hình nhỏ (xs)
                  sm={24} // Chiếm 19/24 phần chiều rộng màn hình nhỏ hơn sm (80% chiều rộng)
                  md={24} // Chiếm 19/24 phần màn hình cỡ trung bình (md)
                  lg={24} // Chiếm 19/24 phần màn hình cỡ lớn (lg)
                  xl={24} // Chiếm 19/24 phần màn hình cực lớn (xl)
                >
                  <InputBasic
                    label="Tên gói"
                    name="name"
                    isSpan
                    disabled={isViewMode}
                    required
                  />
                </Col>
                <Col
                  xs={24} // Chiếm 100% chiều rộng màn hình nhỏ (xs)
                  sm={24} // Chiếm 19/24 phần chiều rộng màn hình nhỏ hơn sm (80% chiều rộng)
                  md={24} // Chiếm 19/24 phần màn hình cỡ trung bình (md)
                  lg={24} // Chiếm 19/24 phần màn hình cỡ lớn (lg)
                  xl={24} // Chiếm 19/24 phần màn hình cực lớn (xl)
                >
                  <InputBasic
                    label="Giá bán"
                    name="price"
                    disabled={isViewMode}
                    isSpan
                    required
                  />
                </Col>
                <Col
                  xs={24} // Chiếm 100% chiều rộng màn hình nhỏ (xs)
                  sm={24} // Chiếm 19/24 phần chiều rộng màn hình nhỏ hơn sm (80% chiều rộng)
                  md={24} // Chiếm 19/24 phần màn hình cỡ trung bình (md)
                  lg={24} // Chiếm 19/24 phần màn hình cỡ lớn (lg)
                  xl={24} // Chiếm 19/24 phần màn hình cực lớn (xl)
                >
                  <InputBasic
                    label="Số lượt đăng tuyển mới"
                    name="count"
                    isSpan
                    disabled={isViewMode}
                    required
                  />
                </Col>
              </Row>
            </Form>
          </div>
        </div>
      </MyModal>
    </>
  );
};

export default PackageCruModal;
