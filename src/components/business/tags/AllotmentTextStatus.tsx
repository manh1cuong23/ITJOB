/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React from 'react';

// Định nghĩa màu sắc cho trạng thái

const statusColors = {
    Unconfirmed: '#DF1010',
    Confirmed: '#6874F6',
    Deposit: '#2FB160',


};
// Component TagStatus
type TagStatusProps = {
    status: 'Unconfirmed' | 'Confirmed' | 'Deposit';
};

const AllotmentTextStatus: React.FC<TagStatusProps> = ({ status }) => {
    return (
        <span
            css={css`
                font-size: 13px;
                line-height: 20px;
                font-weight: 400;
                color: ${statusColors[status]};
            `}>
            {status}
        </span>
    );
};

export default AllotmentTextStatus;
