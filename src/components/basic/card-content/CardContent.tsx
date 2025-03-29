import React, { ReactNode } from 'react';

import './style.less';
interface MyCardProps {
  title?: string | ReactNode;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  moreAction?: ReactNode;
  hasHeader?: boolean;
}

const MyCardContent: React.FC<MyCardProps> = ({
  title,
  children,
  className ='',
  moreAction,
  style,
  hasHeader = true,
}) => {
  return (
    <div className={`my-card-content ${className}`} style={style}>
      {hasHeader && <div className="my-card-content-header">
        <p>{title}</p>
        <div className='my-card-content-more-action'>{moreAction}</div>
      </div>}
      <div className="my-card-content-body">{children}</div>
    </div>
  );
};

export default MyCardContent;
