import { MyButton } from '@/components/basic/button';
import { MyCardContent } from '@/components/basic/card-content';
import { MyModal } from '@/components/basic/modal';
import { Col, Form, Row } from 'antd';
import React, { useEffect } from 'react';
import InputBasic from '../../input/InputBasic';
import RadiosStatus from '../../radios/RadiosStatus';
import {TableBasic} from '@/components/basic/table';
import './ViewPackageService.less';
import { ColumnsView } from '@/containers/package-service/Columns';

export interface IFormViewPackageService {
  code: string;
  full_name: string;
  hotel: string;
  status: string;
  packages: any[];
}
interface IProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onCancel?: () => void;
  formData: IFormViewPackageService;
}
const ViewHotel = (props: IProps) => {
  const { open, onCancel, setOpen, formData } = props;
  const [form] = Form.useForm();

  const initialValues = {
    code: '',
    full_name: '',
    hotel: '',
    status: '',
    packages: [],
  };
  const handleCancel = () => {
    setOpen(!open);
    form.resetFields();
    onCancel && onCancel();
  };
  useEffect(() => {
    form.setFieldsValue(formData);
  });
  return (
    <MyModal
      width={720}
      title={'View Room Type'}
      open={open}
      onCancel={handleCancel}
      footer={
        <>
          <MyButton onClick={handleCancel} buttonType="outline">
            Close
          </MyButton>
        </>
      }>
      <Form form={form} layout="vertical" initialValues={initialValues}>
        <MyCardContent hasHeader={false}>
          <Row gutter={24}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <InputBasic disabled name="code" label="Code" loading ={false}/>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <InputBasic name="full_name" label="Name" disabled loading ={false}/>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <InputBasic name="hotel" label="Hotel" disabled loading ={false}/>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <RadiosStatus disabled  loading ={false}/>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <TableBasic
                columns={ColumnsView}
                dataSource={formData.packages}
                className="view-package-service"
              />
            </Col>
          </Row>
        </MyCardContent>
      </Form>
    </MyModal>
  );
};

export default ViewHotel;
