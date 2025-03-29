import React from 'react';
import { Tooltip } from 'antd';
import './style.less';

interface ActionButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  title?: React.ReactNode;
  tooltipTitle: string;
}

const TableActionButton: React.FC<ActionButtonProps> = ({
  icon,
  onClick,
  title,
  tooltipTitle,
}) => (
  <Tooltip title={tooltipTitle} placement="top">
    <div onClick={onClick} className="table-action-button">
      <div className="icon-wrapper">{icon}</div>
      {title && <span className="title-wrapper">{title}</span>}
    </div>
  </Tooltip>
);

export default TableActionButton;
