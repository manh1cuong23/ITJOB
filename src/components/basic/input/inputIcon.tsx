import { forwardRef, useEffect, useState } from 'react';
import { InputNumber, InputNumberProps, Skeleton } from 'antd';
import './style.less';

interface MyInputProps extends InputNumberProps {
  className?: string;
  blur?: () => void;
  placeholder?: string;
  loading?: boolean;
  Icon?: any;
}

const MyInputIconNumber = forwardRef<HTMLInputElement, MyInputProps>(
  (
    {
      value,
      onChange,
      className = '',
      placeholder = 'Enter',
      blur,
      loading = false,
      Icon,
      ...rest
    },
    ref
  ) => {
    const [showSkeleton, setShowSkeleton] = useState(loading);
    useEffect(() => {
      if (loading) {
        setShowSkeleton(true);
      } else {
        const timeout = setTimeout(() => {
          setShowSkeleton(false);
        }, 100);
        return () => clearTimeout(timeout);
      }
    }, [loading]);
    // const formatter = (value: any) => {
    //   // console.log('value', value);
    //   return '242425,2,2,';
    //   // if (!value) return ''; // Trả về chuỗi rỗng nếu giá trị không hợp lệ
    //   // const parsedValue = parseFloat(value.toString().replace(/,/g, '')); // Xử lý dấu ',' nếu có
    //   // console.log(
    //   //   'parsedValue',
    //   //   parsedValue,
    //   //   parsedValue.toLocaleString('en-US')
    //   // );
    //   // return !isNaN(parsedValue) ? parsedValue.toLocaleString('en-US') : '22'; // Định dạng với dấu ','
    // };

    // const parser = (value: any) => {
    //   // Xóa dấu ',' khi người dùng nhập giá trị
    //   return value ? value.replace(/,/g, '') : '';
    // };
    return (
      <div className={`my-input-container`}>
        <Skeleton.Input
          active
          size="small"
          className={`my-skeleton-input ${className}`}
          style={{
            opacity: showSkeleton ? 1 : 0,
          }}
        />
        <InputNumber
          ref={ref}
          value={value}
          onChange={onChange}
          className={`my-input ${className}`}
          placeholder={placeholder}
          suffix={Icon}
          style={{
            width: '100%',
            opacity: showSkeleton ? 0 : 1,
            transition: 'opacity 0.3s ease-in-out',
          }}
          // formatter={formatter}
          // parser={parser}
          {...rest}
        />
      </div>
    );
  }
);

export default MyInputIconNumber;
