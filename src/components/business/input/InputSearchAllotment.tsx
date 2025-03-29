import { MyFormItem } from '@/components/basic/form-item';
import { MySearchInput } from '@/components/basic/input';

const InputSearchAllotment = () => {
  return (
    <MyFormItem name={'keyword'} labelCol={{ span: 0 }}>
      <MySearchInput
        placeholder={'Search by Allotment ID, Market Segment'}
        style={{ width: '230px' }}

      />
    </MyFormItem>
  );
};

export default InputSearchAllotment;
