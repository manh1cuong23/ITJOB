/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React from 'react';

// Định nghĩa màu sắc cho trạng thái
const statusBgColors = {
  published: '#DCFCE7',
  archived: '#B91C1C',
  draft: '#FEE2E2',
};
const statusColors = {
  published: '#14532D',
  archived: '#B91C1C',
  draft: '#B91C1C',
};
// Component TagStatus
type TagStatusProps = {
  status: 'published' | 'archived' | 'draft';
};

const StatusRate: React.FC<TagStatusProps> = ({ status }) => {
  return (
    <span
      css={css`
        padding: 2px 6px;
        border-radius: 6px;
        font-weight: bold;
        color: ${statusColors[status]};
        background-color: ${statusBgColors[status]};
      `}>
      {status == 'published' ? 'Active' : 'Inactive'}
    </span>
  );
};

export default StatusRate;
