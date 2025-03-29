import { Row, Col } from 'antd';
import InputBasicWithSuffix from '@/components/business/input/InputBasicWithSuffix';
import { SelectHotels, SelectStatus } from '@/components/business/select';
import { ISource } from '@/utils/formatSelectSource';
import { InputBasic } from '@/components/business/input';
import { MyCardContent } from '@/components/basic/card-content';

const QuickSearchForm = () => {
  return (
    <MyCardContent>
      <Row gutter={16}>
        <Col span={8}>
          <InputBasic name="UserName" label="Username" loading={false} />
        </Col>
        <Col span={8}>
          <InputBasic name="LastName" label="Full Name" loading={false} />
        </Col>
        <Col span={8}>
          <InputBasic name="Email" label="Email" loading={false} />
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <InputBasic name="Phone" label="Phone" loading={false} />
        </Col>
        <Col span={8}>
          <SelectStatus name="IsActive" />
        </Col>
      </Row>
    </MyCardContent>
  );
};

export { QuickSearchForm };
