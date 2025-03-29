import { MyFormItem } from '@/components/basic/form-item';
import { MyInput } from '@/components/basic/input';
import { FormInstance } from 'antd';
interface IProps {
  form: FormInstance;
  disabled?: boolean;
  required?: boolean;
  loading?: boolean;
}
const InputEmail = (props: IProps) => {
  const { form, disabled, required = false, loading } = props;
  // Biểu thức chính quy để kiểm tra định dạng email
  const emailPattern =
    /^[a-zA-Z0-9_.]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/;
  return (
    <MyFormItem
      form={form}
      name="email"
      label="Email"
      required={required}
      disabled={disabled}
      rules={[
        {
          pattern: emailPattern,
          message: 'Invalid email',
        },
      ]}>
      <MyInput placeholder="Enter" loading ={loading}/>
    </MyFormItem>
  );
};

export default InputEmail;
