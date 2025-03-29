/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React from 'react';

// Hàm để render trạng thái
const renderStatus = (status: number, disableStyle?: boolean) => {
  let label = '';
  let statusStyle = css``;

  if (disableStyle) {
    return <span>{label}</span>;
  }

  switch (status) {
    case 1:
      label = 'Waiting';
      statusStyle = css`
        padding: 3px 6px;
        border-radius: 6px;
        color: #6b21a8;
        font-weight: bold;
        background-color: #f3e8ff;
      `;
      break;
    case 2:
      label = 'Rejected';
      statusStyle = css`
        padding: 3px 6px;
        border-radius: 6px;
        color: #292524;
        font-weight: bold;
        background-color: #eeedec;
      `;
      break;
    case 3:
      label = 'Confirmed';
      statusStyle = css`
        padding: 3px 6px;
        border-radius: 6px;
        color: #1e40af;
        font-weight: bold;
        background-color: #eeedec;
      `;
      break;
    case 4:
      label = 'Checked In';
      statusStyle = css`
        padding: 3px 6px;
        border-radius: 6px;
        color: #166534;
        font-weight: bold;
        background-color: #dcfce7;
      `;
      break;
    case 5:
      label = 'Closed';
      statusStyle = css`
        padding: 3px 6px;
        border-radius: 6px;
        color: #be185d;
        font-weight: bold;
        background-color: #fce7f3;
      `;
      break;
    case 6:
      label = 'Cancelled';
      statusStyle = css`
        padding: 3px 6px;
        border-radius: 6px;
        color: #991b1b;
        font-weight: bold;
        background-color: #fee2e2;
      `;
      break;
    case 7:
      label = 'Checked out';
      statusStyle = css`
        padding: 3px 6px;
        border-radius: 6px;
        color: #92400e;
        font-weight: bold;
        background-color: #fef3c7;
      `;
      break;
    default:
      label = 'Unknown';
      statusStyle = css`
        padding: 3px 6px;
        border-radius: 6px;
        background-color: #e2e3e5;
        color: #383d41;
      `;
  }

  return <span css={statusStyle}>{label}</span>;
};

// Component BookingStatus
type BookingStatusProps = {
  status: number;
  disableStyle?: boolean;
};

const BookingStatus: React.FC<BookingStatusProps> = ({
  status,
  disableStyle = false,
}) => {
  return <>{renderStatus(status, disableStyle)}</>;
};

export default BookingStatus;
