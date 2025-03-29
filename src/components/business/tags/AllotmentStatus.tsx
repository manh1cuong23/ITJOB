/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React from 'react';

// Định nghĩa màu sắc cho trạng thái
const statusBgColors = {
    Active: '#DCFCE7',
    Done: '#DBEAFE',
    CutOff: '#FEF3C7',
    Overdue: '#FEE2E2',
    Cancelled: '#EEEDEC',
    Transferred: '#F3E8FF',

};
const statusColors = {
    Active: '#14532D',
    Done: '#1E3A8A',
    CutOff: '#78350F',
    Overdue: '#B91C1C',
    Cancelled: '#57534E',
    Transferred: '#6B21A8',

};
// Component TagStatus
type TagStatusProps = {
    status: 'Active' | 'Done' | 'CutOff' | 'Cancelled' | 'Overdue' | 'Transferred';
};

const AllotmentStatus: React.FC<TagStatusProps> = ({ status }) => {
    return (
        <span
            css={css`
                padding: 2px 6px;
                border-radius: 6px;
                font-weight: bold;
                color: ${statusColors[status]};
                background-color: ${statusBgColors[status]};
            `}>
            {status}
        </span>
    );
};

export default AllotmentStatus;
