/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React from 'react';

// Định nghĩa màu sắc cho trạng thái
const statusBgColors = {
  active: '#DCFCE7',
  inactive: '#FEE2E2',
};
const statusColors = {
  active: '#14532D',
  inactive: '#B91C1C',
};
// Component TagStatus
type TagStatusProps = {
  status: 'active' | 'inactive';
};

const TagStatus: React.FC<TagStatusProps> = ({ status }) => {
  return (
    <span
      css={css`
        padding: 2px 6px;
        border-radius: 6px;
        font-weight: bold;
        color: ${statusColors[status]};
        background-color: ${statusBgColors[status]};
      `}>
      {status === 'active' ? 'Active' : 'Inactive'}
    </span>
  );
};

export default TagStatus;
