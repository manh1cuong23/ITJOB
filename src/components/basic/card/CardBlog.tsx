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
    <div className={`${className} p-2 shadow-md`}>
      <div
        className={` border flex flex-col justify-between h-[300px]`}
        style={style}>
        <div className="overflow-hidden">
          <img
            src={data.avatar}
            className="h-[200px] w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        <div className="py-1 mx-2">
          {data.title && (
            <h1 className="text-lg font-bold my-2 truncate">{data.title}</h1>
          )}
        </div>
        <div className="pb-4 mx-2">
          <NavLink
            className="text-sm text-primary !no-underline "
            to={`/blog/${data?._id}`}>{`Bắt đầu đọc >`}</NavLink>
        </div>
      </div>
    </div>
  );
};

export default CardBlog;
