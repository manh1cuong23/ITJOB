import { FC, useState } from 'react';
import { Input } from 'antd';
import { InputProps } from 'antd/lib/input'; // Change from SearchProps to InputProps
import './style.less';
import { SearchOutlined } from '@ant-design/icons';

interface MySearchInputProps extends InputProps {
  label?: string;
  blur?: () => void;
  isQuickSearch?: boolean;
}

const MySearchInput: FC<MySearchInputProps> = ({
  name,
  style,
  onChange,
  blur,
  isQuickSearch = false,
  ...rest
}) => {
  // Hàm xử lý sự kiện blur
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Trim giá trị và gọi onChange nếu có
    const trimmedValue = e.target.value.trim();
    if (onChange) {
      onChange({ ...e, target: { ...e.target, value: trimmedValue } });
    }
  };
  // const handleChangeQuickSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { value } = e.target;

  //   // Hiển thị ngay giá trị đã nhập
  //   if (onChange) {
  //     onChange(e);
  //   }

  //   // Clear previous timeout nếu có
  //   if (typingTimeout) {
  //     clearTimeout(typingTimeout);
  //   }

  //   // Đặt thời gian trì hoãn 1 giây để trim giá trị sau khi người dùng dừng nhập
  //   const newTypingTimeout = setTimeout(() => {
  //     const trimmedValue = value.trim();

  //     // Trim giá trị sau 1 giây

  //     if (onChange) {
  //       console.log('value2', trimmedValue.length);
  //       if (trimmedValue !== e.target.value) {
  //         console.log('da vao day');
  //         onChange({
  //           ...e,
  //           target: { ...e.target, value: trimmedValue },
  //         });
  //       }
  //       // onChange({ ...e, target: { ...e.target, value: trimmedValue } });
  //       console.log('check e', e, 'value', e.target.value.length);
  //     }
  //   }, 300); // 1000ms = 1s

  //   setTypingTimeout(newTypingTimeout); // Cập nhật lại timeout mới
  // };

  // Hàm xử lý sự kiện change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    // Gọi onChange để cập nhật giá trị
    if (onChange) {
      onChange(e);
    }
  };

  // Trả về Input mà không bọc Form.Item
  return (
    <Input
      className="my-input my-input-search"
      allowClear
      prefix={<SearchOutlined className="search-icon" />}
      style={style}
      // maxLength={500}
      // styles={{'width':}}
      // width={500}
      onBlur={handleBlur}
      onChange={handleChange}
      {...rest}
    />
  );
};

export default MySearchInput;
