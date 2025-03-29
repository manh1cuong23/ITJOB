import { Form, FormInstance, FormItemProps, Tooltip } from 'antd';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { ReactComponent as InforSvg } from '@/assets/icons/ic_infor.svg';
import './style.less';
import { omit } from 'lodash';
interface IProps extends FormItemProps {
  children: ReactNode;
  disabled?: boolean;
  form?: FormInstance;
  initialValue?: any;
  isShowLabel?: boolean;
  showInfo?: boolean;
  infoTooltip?: string;
  isHideErrorMessage?: boolean;
  setErrorState?: (e: any) => void;
  messageError?: string | undefined;
  isFormatDolla?: boolean;
  fieldFormat?: string;
}

const FormItem = (props: IProps) => {
  const {
    label,
    fieldFormat,
    required = false,
    children,
    setErrorState,
    disabled = false,
    form,
    isFormatDolla = false,
    messageError = undefined,
    initialValue,
    isHideErrorMessage,
    isShowLabel = true,
    showInfo = false,
    infoTooltip = '',
    ...rest
  } = props;
  const rules = rest.rules || [];
  const [inputValue, setInputValue] = useState(initialValue);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  if (required) {
    rules.push({
      required: true,
      message: !isHideErrorMessage
        ? messageError
          ? messageError
          : `${label} is required`
        : '',
    });
  }
  const getLabel = (required: boolean) => {
    if (!isShowLabel) return;
    return (
      <div
        className="label-wrapper"
        style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <span className="label-txt">{label}</span>
        {required && <span className="label-start">*</span>}
        {showInfo && (
          <Tooltip
            title={infoTooltip}
            trigger="hover"
            open={isTooltipVisible}
            onOpenChange={setIsTooltipVisible}>
            <InforSvg />
          </Tooltip>
        )}
      </div>
    );
  };
  // Hàm xử lý sự kiện blur
  const handleBlur = () => {
    if (rules.length > 0) {
      const fieldName = rest.name;
      if (form && isFormatDolla) {
        const currentValue = form.getFieldValue(fieldName).trim();

        if (currentValue !== '' && !isNaN(Number(currentValue))) {
          // Hủy timeout trước đó nếu có
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }

          // Tạo timeout mới để delay cập nhật giá trị sau 300ms
          timeoutRef.current = setTimeout(() => {
            const formattedValue = Number(currentValue.replace(/\./g, '')) // Bỏ tất cả dấu .
              .toLocaleString('en-US')
              .replace(/,/g, '.'); // Định dạng số với dấu . thay cho ,

            // Cập nhật lại giá trị trong form
            form.setFieldsValue({ [fieldFormat || fieldName]: formattedValue });
            form.validateFields([fieldName]).catch(() => {
              if (setErrorState) {
                setErrorState(true);
              }
            });
          }, 0);
        } else {
        }
      }
      if (form && fieldName) {
        // Nếu có timeout trước đó, hủy bỏ nó
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }

        // Tạo timeout mới
        debounceRef.current = setTimeout(() => {
          try {
            form.validateFields([fieldName]);
          } catch {
            if (setErrorState) {
              setErrorState(true); // Chỉ gọi nếu `setErrorState` không phải là undefined
            }
          }
        }, 300); // Thời gian debouncing là 300ms
      }
    }
  };
  const handleFocus = () => {
    const fieldName = rest.name;
    if (form && fieldName && isFormatDolla) {
      const currentValue = form.getFieldValue(fieldName);
      // Loại bỏ toàn bộ dấu chấm (.)
      const cleanedValue = currentValue ? currentValue.replace(/\./g, '') : '';
      form.setFieldsValue({ [fieldName]: cleanedValue });
    }
  };
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);
  return (
    <Form.Item
      label={getLabel(required)}
      rules={rules}
      colon={false}
      validateTrigger={['blur']}
      initialValue={initialValue}
      validateStatus={props.isHideErrorMessage ? undefined : undefined} // Không hiển thị trạng thái lỗi
      {...(omit(rest, ['rules', 'isHideErrorMessage']) as FormItemProps)}>
      {React.cloneElement(children as React.ReactElement, {
        disabled,
        value: inputValue,
        onBlur: handleBlur,
        onFocus: handleFocus,
      })}
    </Form.Item>
  );
};

export default FormItem;
