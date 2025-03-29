import React from 'react';
import './style.less';
import { formatNumberMoney } from '@/utils/common';
import { Tooltip } from 'antd';

export type CardData = {
  packageName: string;
  sourceName: string;
  sourceId: string;
  rate: string;
  roomTypeName: string;
  availableRooms: number;
  onClick: () => void; 
  isActive: boolean;
};

const CardRoom: React.FC<CardData> = ({
  roomTypeName,
  availableRooms,
  packageName,
  sourceId,
  sourceName,
  rate,
  isActive,
  onClick,
}) => (
  <div  className={`card-room-wrapper ${isActive ? 'active' : ''}`}  onClick={onClick}>
    <div className="card-room-header">
      <h5>{roomTypeName}</h5>
      <div className="number">{availableRooms}</div>
    </div>
    <div className="card-room-body">
      <div className="card-room-item">
        <p className="text-left">Package</p>
        <Tooltip title={packageName}>
          <p
            className="text-right">
            {packageName}
          </p>
        </Tooltip>
      </div>
      <div className="card-room-item">
        <p className="text-left">Source</p>
        {sourceId && (
        <Tooltip title={sourceId}>
          <p className="text-id">{sourceId}</p>
        </Tooltip>
      )}
      <Tooltip title={sourceName}>
        <p className="text-right">{sourceName}</p>
      </Tooltip>
      </div>
      <div className="card-room-item">
        <p className="text-left">Rate</p>
        <p className="text-price">{rate}</p>
      </div>
    </div>
  </div>
);

export default CardRoom;
