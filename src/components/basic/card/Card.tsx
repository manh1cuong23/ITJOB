import React, { ReactNode } from 'react';
import './style.less'
interface MyCardProps {
  title: string | ReactNode;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const MyCard: React.FC<MyCardProps> = ({
  title,
  children,
  className='',
  style,
}) => {
  return (
    <div
      className={`my-card ${className}`}
      style={style}>
      <div className='my-card-header'>
        <p>{title}</p>
      </div>
      <div className='my-card-body'>{children}</div>

    </div>
  );
};

export default MyCard;
