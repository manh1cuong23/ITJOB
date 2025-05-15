import React from 'react';
import { Button } from 'antd';
import NotFoundSvg from '@/assets/icons/ic_not_found_black.svg';
import { ReactComponent as RedoSvg } from '@/assets/icons/ic_redo.svg';

interface NoDataProps {
  isSearched: boolean;
  handleReset?: () => void;
  label?: string;
}

const TableNoData: React.FC<NoDataProps> = ({
  isSearched,
  handleReset,
  label = 'Set to default',
}) => (
  <div className="no-data-found show flex items-center justify-center">
    <img src={NotFoundSvg} alt="Not Found" style={{ width: '100px' }} />
    <div
      className="no-data-txt"
      style={{
        fontWeight: 500,
        color: '#000',
      }}>
      No data found
    </div>
    {isSearched && (
      <Button
        icon={<RedoSvg width={16} height={16} />}
        type="text"
        onClick={handleReset}
        className="no-data-button">
        {label}
      </Button>
    )}
  </div>
);

export default TableNoData;
