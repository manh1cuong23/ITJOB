import React, { ReactNode } from 'react';
import './style.less';
import { NavLink } from 'react-router-dom';
interface MyCardProps {
  title?: string | ReactNode;
  className?: string;
  style?: React.CSSProperties;
  data: any;
}

const CardBlog: React.FC<MyCardProps> = ({
  title,
  data,
  children,
  className = '',
  style,
}) => {
  return (
    <div
      className={` ${className} border flex flex-col justify-between`}
      style={style}>
      <div className="">
        <img src={data.img} />
      </div>
      <div className="p-2">
        {data.title && <h1 className="text-lg font-bold my-2">{data.title}</h1>}

        <h1 className="text-base font-bold text-gray-500">
          {data.description}
        </h1>
      </div>
      <div className="pb-4 mx-2">
        <NavLink
          className="text-sm text !no-underline "
          to="#">{`Bắt Đầu đọc >`}</NavLink>
      </div>
    </div>
  );
};

export default CardBlog;
