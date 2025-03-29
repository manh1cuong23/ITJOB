import {
  forwardRef,
  KeyboardEventHandler,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Input, InputRef, Skeleton, Tooltip } from 'antd';
import { InputProps } from 'antd/lib/input';
import './style.less';
import {
  DollarOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  EyeTwoTone,
} from '@ant-design/icons';

type InputType = 'text' | 'password';

interface MyInputProps extends InputProps {
  inputType?: InputType;
  className?: string;
  maxLength?: number;
  minLength?: number;
  blur?: (value: string) => void;
  placeholder?: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement> | undefined;
  onFocus?: React.FocusEventHandler<HTMLInputElement> | undefined;
  onClick?: React.MouseEventHandler<HTMLInputElement> | undefined;
  status?: 'error' | 'warning' | '';
  loading?: boolean;
  defaultValue?: string;
  isDolla?: boolean;
  showPasswordToggle?: boolean;
  formatter?: any;
  // iconRender?: any;
}

const MyInput = forwardRef<InputRef, MyInputProps>(
  (
    {
      inputType = 'text',
      maxLength = 255,
      minLength,
      value,
      onChange,
      onKeyDown,
      className = '',
      onBlur,
      onFocus,
      disabled = false,
      status,
      onClick,
      blur,
      defaultValue,
      loading = false,
      placeholder = 'Enter',
      isDolla = false,
      showPasswordToggle = false,
      ...rest
    },
    ref
  ) => {
    const inputRef = useRef<InputRef>(null);
    const [showSkeleton, setShowSkeleton] = useState(loading);
    const [showPassword, setShowPassword] = useState(false);

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      const trimmedValue = e.target.value.trim();
      if (onChange) {
        onChange({ ...e, target: { ...e.target, value: trimmedValue } });
      }
      onBlur && onBlur(e);
      blur && blur(trimmedValue);
    };

    const isOverflow = () => {
      if (inputRef.current) {
        const inputElement = inputRef.current.input as HTMLInputElement;
        return inputElement.scrollWidth > inputElement.clientWidth;
      }
      return false;
    };
    const togglePassword = () => {
      setShowPassword(!showPassword);
    };

    const PasswordIcon = showPassword ? (
      <EyeOutlined className="password-toggle-icon" onClick={togglePassword} />
    ) : (
      <EyeInvisibleOutlined
        className="password-toggle-icon"
        onClick={togglePassword}
      />
    );
    const DollaIcon = <DollarOutlined />;
    const InputComponent = inputType === 'password' ? Input.Password : Input;
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

    const getInputType = () => {
      if (inputType === 'password') {
        return showPassword ? 'text' : 'password';
      }
      return inputType;
    };

    return (
      <Tooltip title={isOverflow() ? value : ''}>
        <div className={`my-input-container`}>
          <Skeleton.Input
            active
            size="small"
            className={`my-skeleton-input ${className}`}
            style={{
              opacity: showSkeleton ? 1 : 0,
            }}
          />
          <InputComponent
            ref={inputRef}
            value={value}
            // iconRender={<EyeTwoTone />}
            onBlur={handleBlur}
            defaultValue={defaultValue}
            onChange={onChange}
            className={`my-input ${className}`}
            maxLength={maxLength}
            minLength={minLength}
            placeholder={placeholder}
            allowClear
            onKeyDown={onKeyDown}
            disabled={disabled}
            onFocus={onFocus}
            status={status}
            onClick={onClick}
            suffix={
              <>
                {inputType === 'password' && showPasswordToggle && PasswordIcon}
                {isDolla && DollaIcon}
              </>
            }
            style={{
              opacity: showSkeleton ? 0 : 1,
              transition: 'opacity 0.3s ease-in-out',
            }}
            {...rest}
          />
        </div>
      </Tooltip>
    );
  }
);

export default MyInput;
