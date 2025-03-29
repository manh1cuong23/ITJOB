import React, { ReactNode } from 'react';
import { Button } from 'antd';
interface MyCardProps {
  title: string | ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const MyTag: React.FC<MyCardProps> = ({
  title,
  children,
  className = '',
  style,
}) => {
  return <Button className={className}>{title}</Button>;
};

export default MyTag;
