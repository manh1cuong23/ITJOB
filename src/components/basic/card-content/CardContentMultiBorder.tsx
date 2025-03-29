import React, { ReactNode } from 'react';

import './style.less';
import Divider from 'antd/es/divider';
interface MyCardProps {
  title?: string | ReactNode;
  items: ItemCardProps[];
  className?: string;
  style?: React.CSSProperties;
}

interface ItemCardProps {
  title: string | ReactNode;
  content: ReactNode;
}

const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  //   justifyContent: 'space-between',
};

const MyCardContentMultiBorder: React.FC<MyCardProps> = ({
  title,
  items,
  className = '',
  style,
}) => {
  return (
    <div
      className={`my-card-content-border ${className}`}
      style={{ ...containerStyle, ...style }}>
      {items.map((item, index) => (
        <div
          key={index}
          className="my-card-content-border-item"
          style={{ minWidth: 80, paddingRight: 10 }}>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            {index !== 0 && (
              <Divider style={{ height: '100%' }} type="vertical" />
            )}
            <div>
              <div className="my-card-content-border-header">
                <p>{item.title}</p>
              </div>
              <div className="my-card-content-body">{item.content}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyCardContentMultiBorder;
